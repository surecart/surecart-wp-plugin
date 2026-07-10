/**
 * External dependencies.
 */
import { Component, h, Prop, State, Host, Watch } from '@stencil/core';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies.
 */
import { state as userState, resetUser, VERIFYING, VERIFIED, UNVERIFIED, CODE_EXPIRED } from '@store/user';
import { state as checkoutState } from '@store/checkout';
import { isRateLimited } from '../../../../functions/util';
import { secondsUntil, getBlockedDuplicateSeconds, resendAnchorFrom, RESEND_COOLDOWN_SECONDS } from '../../../../functions/verification';

@Component({
  tag: 'sc-customer-login',
  styleUrl: 'sc-customer-login.scss',
  shadow: true,
})
export class ScCustomerLogin {
  /** The mode of the login */
  @State() mode: 'code' | 'password' = 'code';

  /** Is the component busy */
  @State() busy: boolean = false;

  /** Is code resending */
  @State() codeResending: boolean = false;

  /** Seconds remaining in the resend cooldown */
  @State() resendCooldown: number = 60;

  /** Interval timer reference for cleanup */
  private cooldownInterval: any = null;

  /** Password input ref (password view). */
  private passwordInput?: HTMLScInputElement;

  /** Verification code ref (code view). */
  private verificationCode?: HTMLScVerificationCodeElement;

  /** Focus the active view's field after the next render (set when the mode switches). */
  private focusAfterRender = false;

  /** Error */
  @State() error: string = '';

  /** Code Error coming from the parent */
  @Prop() codeError: string = '';

  /** Lets the parent open in password mode (used on 429 fallback). */
  @Prop() initialMode: 'code' | 'password' = 'code';

  /** Login Password */
  @State() password: string = '';

  /** Set after a 429 — hides the code toggle to prevent a retry loop. */
  @State() codeUnavailable: boolean = false;

  formatCooldown(): string {
    const minutes = Math.floor(this.resendCooldown / 60);
    const seconds = this.resendCooldown % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  async verifyCode(code: string) {
    // If not valid email and code, then return.
    if (!userState.email || !code) {
      return;
    }

    try {
      this.error = '';
      userState.verificationStatus = VERIFYING;
      this.busy = true;
      speak(__('Verifying code...', 'surecart'), 'assertive');

      const user = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes/verify',
        data: {
          login: userState.email,
          code: code,
        },
      })) as any;
      userState.verificationStatus = VERIFIED;

      if (!user?.verified) {
        throw { message: __('Verification code is not valid. Please try again.', 'surecart') };
      }

      // Update the nonce after login to prevent rest_cookie_invalid_nonce errors.
      // @ts-ignore - nonceMiddleware is set in fetch.ts but not in @wordpress/api-fetch types.
      if (user?.nonce && apiFetch.nonceMiddleware) {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = user.nonce;
      }

      // Update userState and make the user as logged in user.
      userState.loggedIn = true;
      userState.name = user?.name || [user?.customer?.first_name, user?.customer?.last_name].filter(Boolean).join(' ') || '';
      userState.avatarUrl = user?.avatar_url || '';

      speak(__('Verification is successful. Please continue your purchase.', 'surecart'), 'assertive');
    } catch (e: any) {
      // If cooldown has elapsed, treat as expired code.
      if (this.resendCooldown <= 0) {
        userState.verificationStatus = CODE_EXPIRED;
        this.error = '';
        speak(__('Code expired. Please send a new code.', 'surecart'), 'assertive');
      } else if (isRateLimited(e)) {
        this.error = __('Please wait a moment and try again.', 'surecart');
        userState.verificationStatus = UNVERIFIED;
        speak(this.error, 'assertive');
      } else {
        if (e.code === 'not_found') {
          this.error = __('Incorrect code. Please try again.', 'surecart');
        } else {
          this.error = e?.message || __('Incorrect code. Please try again.', 'surecart');
        }
        userState.verificationStatus = UNVERIFIED;
        speak(this.error, 'assertive');
      }
    } finally {
      this.busy = false;
    }
  }

  async resendCode() {
    try {
      this.error = '';
      this.codeResending = true;
      speak(__('Sending code...', 'surecart'), 'assertive');
      const response = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/verification_codes',
        data: {
          login: userState.email,
          checkout_mode: checkoutState.mode,
        },
      })) as any;

      speak(__('Code sent', 'surecart'), 'assertive');
      userState.verificationStatus = UNVERIFIED;
      // Always anchor a fresh window (falls back to default if platform omits it).
      userState.resendAvailableAt = resendAnchorFrom(response?.resend_available_in);
      this.startCooldown();
    } catch (e) {
      console.error(e);
      this.handleCodeSendError(e);
    } finally {
      this.codeResending = false;
    }
  }

  handleCodeSendError(error: any) {
    // 429: switch to password (different endpoint, no limit conflict).
    if (isRateLimited(error)) {
      this.mode = 'password';
      this.codeUnavailable = true;
      this.error = __('Please sign in with your password to continue.', 'surecart');
      this.startCooldown();
      return;
    }

    const blockedSeconds = getBlockedDuplicateSeconds(error);

    (error?.additional_errors || []).forEach((e: any) => {
      if (e?.code === 'verification_code.email.blocked_duplicate') {
        this.error = e?.message || __('A code was just sent to you, please wait a minute before resending.', 'surecart');
        // Resume from the platform's reported backoff window (default if absent).
        userState.resendAvailableAt = resendAnchorFrom(blockedSeconds);
        this.startCooldown();
      }
    });
  }

  /** Seconds left in the cooldown, always derived from the (decaying) anchor timestamp. */
  private remainingCooldown(): number {
    return secondsUntil(userState.resendAvailableAt);
  }

  startCooldown() {
    clearInterval(this.cooldownInterval);

    // Guarantee a concrete anchor so the countdown always decays to 0 and the
    // resend link returns — never a stuck constant.
    if (userState.resendAvailableAt == null) {
      userState.resendAvailableAt = resendAnchorFrom(RESEND_COOLDOWN_SECONDS);
    }

    this.resendCooldown = this.remainingCooldown();

    if (this.resendCooldown <= 0) return;

    // Recompute from the anchor each tick so the timer stays correct even if the
    // tab was backgrounded (throttled intervals) or the page was reloaded.
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown = this.remainingCooldown();

      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownInterval);
        this.cooldownInterval = null;
        speak(__('You can resend the code now.', 'surecart'), 'assertive');
      }
    }, 1000);
  }

  componentWillLoad() {
    this.mode = this.initialMode;
    // initialMode='password' means the parent already 429'd on code-send.
    this.codeUnavailable = this.initialMode === 'password';
    this.startCooldown();
  }

  /** When the user switches views, focus that view's first field after it renders. */
  @Watch('mode')
  handleModeChange() {
    this.focusAfterRender = true;
  }

  componentDidRender() {
    if (!this.focusAfterRender) return;
    this.focusAfterRender = false;

    // Wait for the freshly rendered child to be ready, then focus it.
    if (this.mode === 'password') {
      this.passwordInput?.componentOnReady?.().then(() => this.passwordInput?.triggerFocus());
    } else {
      this.verificationCode?.componentOnReady?.().then(() => this.verificationCode?.triggerFocus());
    }
  }

  disconnectedCallback() {
    clearInterval(this.cooldownInterval);
  }

  async loginByPassword(e: any) {
    e.preventDefault();

    try {
      this.error = '';
      this.busy = true;
      const { name, email, avatar_url, nonce } = (await apiFetch({
        method: 'POST',
        path: 'surecart/v1/login',
        data: {
          login: userState.email,
          password: this.password,
        },
      })) as any;

      // Update the nonce after login to prevent rest_cookie_invalid_nonce errors.
      // @ts-ignore - nonceMiddleware is set in fetch.ts but not in @wordpress/api-fetch types.
      if (nonce && apiFetch.nonceMiddleware) {
        // @ts-ignore
        apiFetch.nonceMiddleware.nonce = nonce;
      }

      userState.loggedIn = true;
      userState.verificationStatus = VERIFIED;
      userState.name = name;
      userState.email = email;
      userState.avatarUrl = avatar_url || '';
    } catch (e: any) {
      this.error = isRateLimited(e) ? __('Please wait a moment and try again.', 'surecart') : e?.message || __('Login failed. Please try again.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  renderSentInfo() {
    // Don't claim a code was sent if we 429'd before it left.
    const headline = this.codeUnavailable ? __('Signing in as', 'surecart') : __('Code sent to', 'surecart');
    const iconName = this.codeUnavailable ? 'user' : 'mail';

    return (
      <div class="customer-code__sent-info">
        <sc-icon name={iconName} class="customer-code__mail-icon" aria-hidden="true" />
        <span>
          {headline} <strong class="customer-code__sent-email">{userState.email}</strong>
        </span>
        <a
          href="#"
          class="customer-code__change-link"
          onClick={e => {
            e.preventDefault();
            resetUser();
          }}
        >
          {__('Change', 'surecart')}
        </a>
      </div>
    );
  }

  renderCodeFooter() {
    const isExpired = userState.verificationStatus === CODE_EXPIRED;

    return (
      <div class="customer-code__footer">
        <div class="customer-code__footer-left">
          {!isExpired && this.resendCooldown > 0 && (
            <span class="customer-code__resend-timer">
              {__('Resend code in', 'surecart')} {this.formatCooldown()}
            </span>
          )}
          {!isExpired && this.resendCooldown <= 0 && (
            <a
              href="#"
              class="customer-code__resend-link"
              onClick={e => {
                e.preventDefault();
                this.resendCode();
              }}
            >
              {this.codeResending ? __('Sending...', 'surecart') : __('Resend Code', 'surecart')}
            </a>
          )}
        </div>
        <div class="customer-code__footer-right">
          <a
            href="#"
            class="customer-code__mode-link"
            onClick={e => {
              e.preventDefault();
              this.error = '';
              this.mode = 'password';
            }}
          >
            <sc-icon name="lock" aria-hidden="true" />
            {__('Use Password', 'surecart')}
          </a>
        </div>
      </div>
    );
  }

  renderPasswordView() {
    return (
      <div class="customer-password">
        {this.renderSentInfo()}
        <sc-flex alignItems="center">
          <sc-input
            ref={el => (this.passwordInput = el)}
            type="password"
            style={{ flex: '1' }}
            placeholder={__('Password', 'surecart')}
            required
            disabled={this.busy}
            onScInput={(e: any) => (this.password = e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                this.loginByPassword(e);
              }
            }}
          />
          <sc-button size="medium" type="primary" loading={this.busy} onClick={(e: any) => this.loginByPassword(e)}>
            <sc-icon slot="prefix" name="lock" />
            &nbsp;
            {__('Login', 'surecart')}
          </sc-button>
        </sc-flex>
        {!!(this.error || this.codeError) && <p class="customer-password__error" role="alert" innerHTML={this.error || this.codeError}></p>}
        {!this.codeUnavailable && (
          <div class="customer-code__footer">
            <div class="customer-code__footer-left"></div>
            <div class="customer-code__footer-right">
              <a
                href="#"
                class="customer-code__mode-link"
                onClick={e => {
                  e.preventDefault();
                  this.error = '';
                  this.mode = 'code';
                }}
              >
                <sc-icon name="key" aria-hidden="true" />
                {__('Use Login Code', 'surecart')}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderCodeView() {
    const isExpired = userState.verificationStatus === CODE_EXPIRED;
    const isVerifying = userState.verificationStatus === VERIFYING;

    return (
      <div class="customer-code">
        {this.renderSentInfo()}

        <div>
          <sc-verification-code ref={el => (this.verificationCode = el)} total={6} loading={this.busy} onChange={((value: string) => this.verifyCode(value)) as any} />
        </div>

        {isVerifying && (
          <div class="customer-code__verifying">
            <sc-spinner />
            <span>{__('Verifying...', 'surecart')}</span>
          </div>
        )}

        {isExpired && (
          <p class="customer-code__expired" role="alert">
            {__('Code expired.', 'surecart')}{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.resendCode();
              }}
            >
              {__('Send new code', 'surecart')}
            </a>
          </p>
        )}

        {!isExpired && (!!this.error || !!this.codeError) && <p class="customer-code__error" role="alert" innerHTML={this.error || this.codeError}></p>}

        {this.renderCodeFooter()}
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class="customer-login">{this.mode === 'code' ? this.renderCodeView() : this.renderPasswordView()}</div>
      </Host>
    );
  }
}

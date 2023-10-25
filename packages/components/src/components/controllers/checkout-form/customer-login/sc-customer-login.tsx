import { Component, h, Host, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-customer-login',
  styleUrl: 'sc-customer-login.scss',
  shadow: true,
})
export class ScCustomerLogin {
  // User props.
  @Prop() user: any = null;

  /** Is verification code matched */
  @State() matched: boolean = false;

  render() {
    return (
      <Host>
        <div class="customer-login-area">
          <sc-flex alignItems="center" justifyContent="space-between">
            <p>Email</p>
            <span class="customer-email">{this.user?.email}</span>
          </sc-flex>
          <sc-divider></sc-divider>

          <div>
            <p class="code-hint">
              Enter the code sent to <span class="reset-email-preview">ma..@gmail.com</span> to securely use your saved information.
            </p>
            <div>
              <div class="reset-code-area">
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input type="text" />
                <input
                  type="text"
                  onInput={e => {
                    console.log('e.target.value', e.target);
                    this.matched = true;
                  }}
                />
                {this.matched && (
                  <div class="matched-icon">
                    <sc-icon name="check" />
                  </div>
                )}
              </div>
            </div>

            <div class="resend-code-button">
              <a href="#">Resend Code</a>
            </div>

            <div class="use-password">
              <a href="#">
                Use Password <sc-icon name="chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

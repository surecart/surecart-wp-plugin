import { Component, Element, h, Prop, State, Watch, Fragment, Method, Event, EventEmitter } from '@stencil/core';
import { speak } from '@wordpress/a11y';
import { __, sprintf, _n } from '@wordpress/i18n';
import { isRtl } from '../../../functions/page-align';
import { getHumanDiscount, getHumanDiscountRedeemableStatus } from '../../../functions/price';
import { DiscountResponse } from '../../../types';
import { state as checkoutState } from '../../../store/checkout';

/**
 * @part base - The elements base wrapper.
 * @part form - The form.
 * @part input__base - The input base.
 * @part input - The input.
 * @part input__form-control - The input form control.
 * @part button__base - The button base element.
 * @part button__label - The button label.
 * @part info - The discount info.
 * @part discount - The discount displayed (% off)
 * @part amount - The discount amount.
 * @part discount-label - The discount label.
 * @part coupon-tag - The coupon tag.
 * @part error__base - The error base.
 * @part error__icon - The error icon
 * @part error__text - The error text.
 * @part error_title - The error title.
 * @part error__message - The error message.
 * @part block-ui - The block ui base component.
 * @part block-ui__content - The block ui content (spinner).
 */
@Component({
  tag: 'sc-coupon-form',
  styleUrl: 'sc-coupon-form.scss',
  shadow: true,
})
export class ScCouponForm {
  @Element() el: HTMLScCouponFormElement;
  private input: HTMLScInputElement;
  private couponTag: HTMLScTagElement;
  private addCouponTrigger: HTMLElement;

  /** The label for the coupon form */
  @Prop() label: string;

  /** Is the form loading */
  @Prop() loading: boolean;

  /** Is the form calculating */
  @Prop() busy: boolean;

  /** The placeholder for the input */
  @Prop() placeholder: string;

  /** The error message */
  @Prop({ mutable: true }) error: string;

  /** Force the form to show */
  @Prop() forceOpen: boolean;

  /** The discount */
  @Prop() discount: DiscountResponse;

  /** Currency */
  @Prop() currency: string;

  /** The discount amount */
  @Prop() discountAmount: number;

  /** Has recurring */
  @Prop() showInterval: boolean;

  /** Is it open */
  @Prop({ mutable: true }) open: boolean;

  @Prop() collapsed: boolean;

  /** The value of the input */
  @State() value: string;

  /** When the coupon is applied */
  @Event() scApplyCoupon: EventEmitter<string>;

  /** The text for apply button */
  @Prop({ reflect: true }) buttonText: string;

  /** Is the form editable */
  @Prop() editable: boolean = true;

  /** Auto focus the input when opened. */
  @Watch('open')
  handleOpenChange(val) {
    if (val) {
      setTimeout(() => this.input.triggerFocus(), 50);
    }
  }

  /** Close it when blurred and no value. */
  handleBlur() {
    if (!this.value) {
      this.open = false;
      this.error = '';
    }
  }

  getHumanReadableDiscount() {
    if (this?.discount?.coupon && this?.discount?.coupon.percent_off) {
      return getHumanDiscount(this?.discount?.coupon);
    }
    return '';
  }

  /** Apply the coupon. */
  applyCoupon() {
    this.scApplyCoupon.emit(this.value);
  }

  handleKeyDown(e) {
    if (e?.code === 'Enter') {
      this.applyCoupon();
    } else if (e?.code === 'Escape') {
      this.scApplyCoupon.emit(null);
      this.open = false;
      speak(__('Coupon code field closed.', 'surecart'), 'assertive');
    }
  }

  translateHumanDiscountWithDuration(humanDiscount) {
    if (!this.showInterval) return humanDiscount;

    const { duration, duration_in_months } = this.discount?.coupon;
    switch (duration) {
      case 'once':
        return `${humanDiscount} ${__('once', 'surecart')}`;
      case 'repeating':
        const monthsLabel = sprintf(_n('%d month', '%d months', duration_in_months, 'surecart'), duration_in_months);
        // translators: %s is the discount amount, %s is the duration (e.g. 3 months)
        return sprintf(__('%s for %s', 'surecart'), humanDiscount, monthsLabel);
      default:
        return humanDiscount;
    }
  }

  /** Focus the input. */
  @Method()
  async triggerFocus() {
    await new Promise(resolve => requestAnimationFrame(resolve));

    if (this?.discount?.promotion?.code) {
      (this.couponTag.shadowRoot.querySelector('*') as HTMLElement)?.focus();
    } else if (this.addCouponTrigger) {
      this.addCouponTrigger.focus();
    }
  }

  renderTrialText() {
    if (this.discount?.coupon?.duration === 'once') {
      return __('Applies on first payment', 'surecart');
    }
    return __('Starting on first payment', 'surecart');
  }

  render() {
    const isFreeTrial = !!checkoutState?.checkout?.trial_amount && !checkoutState?.checkout?.amount_due;

    if (this.loading) {
      return <sc-skeleton style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>;
    }

    if (this?.discount?.promotion?.code) {
      let humanDiscount = this.getHumanReadableDiscount();

      return (
        <sc-line-item exportparts="description:info, price-description:discount, price:amount">
          <span slot="description">
            <div part="discount-label">{__('Discount', 'surecart')}</div>
            <sc-tag
              exportparts="base:coupon-tag"
              type={'redeemable' === this.discount?.redeemable_status ? 'success' : 'warning'}
              class="coupon-tag"
              clearable={this.editable}
              onScClear={() => {
                if (!this.editable) return;
                this.scApplyCoupon.emit(null);
                this.open = false;
              }}
              onKeyDown={e => {
                if (!this.editable) return;
                if (e.key === 'Enter' || e.key === 'Escape') {
                  speak(__('Coupon was removed.', 'surecart'), 'assertive');
                  this.scApplyCoupon.emit(null);
                  this.open = false;
                }
              }}
              ref={el => (this.couponTag = el as HTMLScTagElement)}
              role="button"
              // translators: %s is the coupon code.
              aria-label={sprintf(__('Press enter to remove coupon code %s.', 'surecart'), this?.discount?.promotion?.code || this.input.value || '')}
            >
              {this?.discount?.promotion?.code}
            </sc-tag>
          </span>

          {'redeemable' === this.discount?.redeemable_status ? (
            <Fragment>
              {humanDiscount && (
                <span class="coupon-human-discount" slot="price-description">
                  {this.translateHumanDiscountWithDuration(humanDiscount)}
                </span>
              )}
              <span slot={isFreeTrial ? 'price-description' : 'price'}>
                {isFreeTrial ? this.renderTrialText() : <sc-format-number type="currency" currency={this?.currency} value={this?.discountAmount}></sc-format-number>}
              </span>
            </Fragment>
          ) : (
            <div class="coupon__status" slot="price-description">
              <sc-icon name="alert-triangle" />
              {getHumanDiscountRedeemableStatus(this.discount?.redeemable_status)}
            </div>
          )}
        </sc-line-item>
      );
    }

    return this.collapsed ? (
      <div
        part="base"
        class={{
          'coupon-form': true,
          'coupon-form--is-open': this.open || this.forceOpen,
          'coupon-form--has-value': !!this.value,
          'coupon-form--is-rtl': isRtl(),
        }}
      >
        <div
          part="label"
          class="trigger"
          onMouseDown={() => {
            if (this.open) {
              return;
            }
            this.open = true;
          }}
          onKeyDown={e => {
            if (e.key !== 'Enter' && e.key !== ' ') {
              return true;
            }
            if (this.open) {
              return;
            }
            this.open = true;
            speak(__('Coupon code field opened. Press Escape button to close it.', 'surecart'), 'assertive');
          }}
          tabindex="0"
          ref={el => (this.addCouponTrigger = el as HTMLElement)}
          role="button"
        >
          <slot name="label">{this.label}</slot>
        </div>

        <div class="form" part="form">
          <sc-input
            exportparts="base:input__base, input, form-control:input__form-control"
            value={this.value}
            onScInput={(e: any) => (this.value = e.target.value)}
            placeholder={this.placeholder}
            onScBlur={() => this.handleBlur()}
            onKeyDown={e => this.handleKeyDown(e)}
            ref={el => (this.input = el as HTMLScInputElement)}
            aria-label={__('Add coupon code.', 'surecart')}
          >
            <sc-button
              exportparts="base:button__base, label:button_label"
              slot="suffix"
              type="text"
              loading={this.busy}
              size="medium"
              class="coupon-button"
              onClick={() => this.applyCoupon()}
            >
              <slot>{this.buttonText}</slot>
            </sc-button>
          </sc-input>
          <sc-button
            exportparts="base:button__base, label:button_label"
            type="primary"
            outline
            loading={this.busy}
            size="medium"
            class="coupon-button-mobile"
            onClick={() => this.applyCoupon()}
          >
            <slot>{this.buttonText}</slot>
          </sc-button>
          {!!this.error && (
            <sc-alert exportparts="base:error__base, icon:error__icon, text:error__text, title:error_title, message:error__message" type="danger" open>
              <span slot="title">{this.error}</span>
            </sc-alert>
          )}
        </div>

        {this.loading && <sc-block-ui exportparts="base:block-ui, content:block-ui__content"></sc-block-ui>}
      </div>
    ) : (
      <div
        class={{
          'coupon-form': true,
          'coupon-form--has-value': !!this.value,
          'coupon-form--is-rtl': isRtl(),
        }}
      >
        <sc-input
          label={this.label}
          exportparts="base:input__base, input, form-control:input__form-control"
          value={this.value}
          onScInput={(e: any) => (this.value = e.target.value)}
          placeholder={this.placeholder}
          onScBlur={() => this.handleBlur()}
          onKeyDown={e => this.handleKeyDown(e)}
          ref={el => (this.input = el as HTMLScInputElement)}
        >
          <sc-button
            exportparts="base:button__base, label:button_label"
            slot="suffix"
            type="text"
            loading={this.busy}
            size="medium"
            class="coupon-button"
            onClick={() => this.applyCoupon()}
          >
            <slot>{this.buttonText}</slot>
          </sc-button>
        </sc-input>
        <sc-button
          exportparts="base:button__base, label:button_label"
          type="primary"
          outline
          loading={this.busy}
          size="medium"
          class="coupon-button-mobile"
          onClick={() => this.applyCoupon()}
        >
          <slot>{this.buttonText}</slot>
        </sc-button>
        {!!this.error && (
          <sc-alert exportparts="base:error__base, icon:error__icon, text:error__text, title:error_title, message:error__message" type="danger" open>
            <span slot="title">{this.error}</span>
          </sc-alert>
        )}
      </div>
    );
  }
}

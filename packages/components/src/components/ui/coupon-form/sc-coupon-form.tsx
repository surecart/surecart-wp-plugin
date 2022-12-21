import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { getHumanDiscount } from '../../../functions/price';
import { DiscountResponse } from '../../../types';

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
  private input: HTMLScInputElement;

  /** The label for the coupon form */
  @Prop() label: string;

  /** Is the form loading */
  @Prop() loading: boolean;

  /** Is the form calculating */
  @Prop() busy: boolean;

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

  /** Is it open */
  @Prop({ mutable: true }) open: boolean;

  /** The value of the input */
  @State() value: string;

  /** When the coupon is applied */
  @Event() scApplyCoupon: EventEmitter<string>;

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

  /** Apply the coupon. */
  applyCoupon() {
    this.scApplyCoupon.emit(this.input.value.toUpperCase());
  }

  handleKeyDown(e) {
    if (e?.code === 'Enter') {
      this.applyCoupon();
    }
  }

  render() {
    if (this.loading) {
      return <sc-skeleton style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>;
    }

    if (this?.discount?.promotion?.code) {
      let humanDiscount = '';

      if (this?.discount?.coupon && this?.discount?.coupon.percent_off) {
        humanDiscount = getHumanDiscount(this?.discount?.coupon);
      }

      return (
        <sc-line-item exportparts="description:info, price-description:discount, price:amount">
          <span slot="description">
            <div part="discount-label">{__('Discount', 'surecart')}</div>
            <sc-tag
              exportparts="base:coupon-tag"
              type="success"
              class="coupon-tag"
              clearable
              onScClear={() => {
                this.scApplyCoupon.emit(null);
                this.open = false;
              }}
            >
              {this?.discount?.promotion?.code}
            </sc-tag>
          </span>

          {humanDiscount && (
            <span class="coupon-human-discount" slot="price-description">
              ({humanDiscount})
            </span>
          )}

          <span slot="price">
            <sc-format-number type="currency" currency={this?.currency} value={this?.discountAmount}></sc-format-number>
          </span>
        </sc-line-item>
      );
    }

    return (
      <div
        part="base"
        class={{
          'coupon-form': true,
          'coupon-form--is-open': this.open || this.forceOpen,
          'coupon-form--has-value': !!this.value,
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
        >
          <slot name="label">{this.label}</slot>
        </div>

        <div class="form" part="form">
          <sc-input
            exportparts="base:input__base, input, form-control:input__form-control"
            value={this.value}
            onScInput={(e: any) => (this.value = e.target.value)}
            placeholder={__('Enter coupon code', 'surecart')}
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
              <slot />
            </sc-button>
          </sc-input>
          {!!this.error && (
            <sc-alert exportparts="base:error__base, icon:error__icon, text:error__text, title:error_title, message:error__message" type="danger" open>
              <span slot="title">{this.error}</span>
            </sc-alert>
          )}
        </div>

        {this.loading && <sc-block-ui exportparts="base:block-ui, content:block-ui__content"></sc-block-ui>}
      </div>
    );
  }
}

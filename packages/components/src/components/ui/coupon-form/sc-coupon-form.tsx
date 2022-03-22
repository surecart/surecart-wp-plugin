import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { getHumanDiscount } from '../../../functions/price';
import { DiscountResponse } from '../../../types';

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
    if (!this.input.value) {
      this.open = false;
      this.error = '';
    }
  }

  /** Apply the coupon. */
  applyCoupon() {
    this.scApplyCoupon.emit(this.input.value);
  }

  render() {
    if (this.loading) {
      return <sc-skeleton style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>;
    }

    if (this?.discount?.promotion?.code) {
      let humanDiscount = '';

      if (this?.discount?.coupon) {
        humanDiscount = getHumanDiscount(this?.discount?.coupon);
      }

      return (
        <sc-line-item>
          <span slot="description">
            <div>{__('Discount')}</div>
            <sc-tag
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
        class={{
          'coupon-form': true,
          'coupon-form--is-open': this.open || this.forceOpen,
        }}
      >
        <div
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

        <div class="form">
          <sc-input onScBlur={() => this.handleBlur()} ref={el => (this.input = el as HTMLScInputElement)} clearable></sc-input>
          {!!this.error && (
            <sc-alert type="danger" open>
              <span slot="title">{this.error}</span>
            </sc-alert>
          )}
          <sc-button type="primary" full onClick={() => this.applyCoupon()}>
            <slot />
          </sc-button>
        </div>

        {this.loading && <sc-block-ui></sc-block-ui>}
      </div>
    );
  }
}

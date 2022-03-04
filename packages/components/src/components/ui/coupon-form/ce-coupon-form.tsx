import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { getHumanDiscount } from '../../../functions/price';
import { DiscountResponse } from '../../../types';

@Component({
  tag: 'ce-coupon-form',
  styleUrl: 'ce-coupon-form.scss',
  shadow: true,
})
export class CeCouponForm {
  private input: HTMLCeInputElement;

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
  @State() open: boolean;

  /** The value of the input */
  @State() value: string;

  /** When the coupon is applied */
  @Event() ceApplyCoupon: EventEmitter<string>;

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
    this.ceApplyCoupon.emit(this.input.value);
  }

  render() {
    if (this.loading) {
      return <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>;
    }

    if (this?.discount?.promotion?.code) {
      let humanDiscount = '';

      if (this?.discount?.coupon) {
        humanDiscount = getHumanDiscount(this?.discount?.coupon);
      }

      return (
        <ce-line-item>
          <ce-tag
            type="success"
            class="coupon-tag"
            slot="title"
            clearable
            onCeClear={() => {
              this.ceApplyCoupon.emit(null);
              this.open = false;
            }}
          >
            {this?.discount?.promotion?.code}
          </ce-tag>

          {humanDiscount && (
            <span class="coupon-human-discount" slot="price-description">
              ({humanDiscount})
            </span>
          )}

          <span slot="price">
            <ce-format-number type="currency" currency={this?.currency} value={this?.discountAmount}></ce-format-number>
          </span>
        </ce-line-item>
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
          <ce-input onCeBlur={() => this.handleBlur()} ref={el => (this.input = el as HTMLCeInputElement)} clearable></ce-input>
          {!!this.error && (
            <ce-alert type="danger" open>
              <span slot="title">{this.error}</span>
            </ce-alert>
          )}
          <ce-button type="primary" full onClick={() => this.applyCoupon()}>
            <slot />
          </ce-button>
        </div>

        {this.loading && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

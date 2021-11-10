import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { CheckoutSession } from '../../../types';
import { getHumanDiscount } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';
@Component({
  tag: 'ce-coupon-form',
  styleUrl: 'ce-coupon-form.scss',
  shadow: true,
})
export class CeCouponForm {
  private input: HTMLCeInputElement;

  @Prop() label: string;
  @Prop() loading: boolean;
  @Prop() calculating: boolean;
  @Prop() error: any;
  @Prop() checkoutSession: CheckoutSession;

  @State() open: boolean;
  @State() value: string;
  @State() errorMessage: string;

  @Event() ceApplyCoupon: EventEmitter<string>;

  @Watch('error')
  handleErrorsChange() {
    const error = (this?.error?.additional_errors || []).find(error => error?.data?.attribute === 'discount.promotion_code');
    this.errorMessage = error?.message ? error?.message : '';
  }

  @Watch('open')
  handleOpenChange(val) {
    if (val) {
      setTimeout(() => this.input.triggerFocus(), 50);
    }
  }

  handleBlur() {
    if (!this.input.value) {
      this.open = false;
    }
  }

  applyCoupon() {
    this.ceApplyCoupon.emit(this.input.value);
  }

  render() {
    if (this.loading) {
      return <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>;
    }

    if (this.checkoutSession?.discount?.promotion?.code) {
      let humanDiscount = '';

      if (this.checkoutSession.discount?.coupon) {
        humanDiscount = getHumanDiscount(this.checkoutSession.discount?.coupon);
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
            {this.checkoutSession.discount?.promotion?.code}
          </ce-tag>

          {humanDiscount && (
            <span class="coupon-human-discount" slot="description">
              ({humanDiscount})
            </span>
          )}

          <span slot="price">
            -<ce-format-number type="currency" currency={this.checkoutSession?.currency} value={this.checkoutSession?.discount_amount}></ce-format-number>
          </span>

          <span slot="price-description">&nbsp;</span>
        </ce-line-item>
      );
    }

    return (
      <div
        class={{
          'coupon-form': true,
          'coupon-form--is-open': this.open,
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
          {this.label}
        </div>

        <div class="form">
          <ce-input onCeBlur={() => this.handleBlur()} autofocus ref={el => (this.input = el as HTMLCeInputElement)}></ce-input>
          {!!this.errorMessage && (
            <ce-alert type="danger" open>
              <span slot="title">{this.errorMessage}</span>
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

openWormhole(CeCouponForm, ['loading', 'checkoutSession', 'error'], false);

import { Component, State, h, Watch, Prop, Event, EventEmitter } from '@stencil/core';
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

  @State() open: boolean;
  @State() value: string;

  @Event() ceApplyCoupon: EventEmitter<string>;

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
          <ce-button type="primary" full onClick={() => this.applyCoupon()}>
            <slot />
          </ce-button>
        </div>

        {this.loading && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CeCouponForm, ['loading', 'checkoutSession'], false);

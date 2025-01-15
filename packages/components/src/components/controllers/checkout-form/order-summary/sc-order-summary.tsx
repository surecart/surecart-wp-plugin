import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

import { state as checkoutState } from '@store/checkout';
import { formBusy, formLoading } from '@store/form/getters';
import { animateTo, shimKeyframesHeightAuto, stopAnimations } from '../../../../functions/animate';
import { getAnimation, setDefaultAnimation } from '../../../../functions/animation-registry';
import { Checkout, Invoice } from '../../../../types';

@Component({
  tag: 'sc-order-summary',
  styleUrl: 'sc-order-summary.scss',
  shadow: true,
})
export class ScOrderSummary {
  private body: HTMLElement;
  @Element() el: HTMLScOrderSummaryElement;
  @Prop() order: Checkout;
  @Prop() busy: boolean;
  @Prop() orderSummaryText: string = __('Summary', 'surecart');
  @Prop() invoiceSummaryText: string = __('Invoice Summary', 'surecart');
  @Prop() collapsible: boolean = false;
  @Prop() collapsedOnMobile: boolean = false;
  @Prop() collapsedOnDesktop: boolean;

  @Prop({ mutable: true }) collapsed: boolean = false;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  /** Show the toggle */
  @Event() scHide: EventEmitter<void>;

  isMobileScreen(): boolean {
    const bodyRect = document.body?.getClientRects();
    return bodyRect?.length && bodyRect[0]?.width < 781;
  }

  componentWillLoad() {
    if (this.isMobileScreen()) {
      this.collapsed = this.collapsed || this.collapsedOnMobile;
    } else {
      this.collapsed = this.collapsed || this.collapsedOnDesktop;
    }

    this.handleOpenChange();
  }

  handleClick(e) {
    e.preventDefault();
    if (this.empty() && !formBusy()) return;
    this.collapsed = !this.collapsed;
  }

  /** It's empty if there are no items or the mode does not match. */
  empty() {
    return !checkoutState.checkout?.line_items?.pagination?.count || (checkoutState?.checkout?.live_mode ? checkoutState?.mode === 'test' : checkoutState?.mode === 'live');
  }

  getSummaryText() {
    // If we have an invoice, show the invoice summary text instead.
    if ((checkoutState.checkout?.invoice as Invoice)?.id) {
      return this.invoiceSummaryText || __('Invoice Summary', 'surecart');
    }

    return this.orderSummaryText || __('Summary', 'surecart');
  }

  renderHeader() {
    // busy state
    if ((formBusy() || formLoading()) && !checkoutState.checkout?.line_items?.data?.length) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
          <sc-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
        <span
          class="collapse-link"
          slot="title"
          onClick={e => this.handleClick(e)}
          tabIndex={0}
          aria-label={sprintf(__('Order Summary %s', 'surecart'), this.collapsed ? __('collapsed', 'surecart') : __('expanded', 'surecart'))}
          onKeyDown={e => {
            if (e.key === ' ') {
              this.handleClick(e);
              speak(sprintf(__('Order Summary %s', 'surecart'), this.collapsed ? __('collapsed', 'surecart') : __('expanded', 'surecart')), 'assertive');
            }
          }}
        >
          {this.getSummaryText()}
          <svg xmlns="http://www.w3.org/2000/svg" class="collapse-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span slot="description">
          <slot name="description" />
        </span>

        {/* We have a trial, do not show total_savings_amount since it's based on the total_amount */}
        {checkoutState.checkout?.total_amount !== checkoutState.checkout?.amount_due ? (
          <span slot="price" class={{ 'price': true, 'price--collapsed': this.collapsed }}>
            <sc-format-number class="total-price" type="currency" currency={checkoutState.checkout?.currency} value={checkoutState.checkout?.amount_due}></sc-format-number>
          </span>
        ) : (
          <span slot="price" class={{ 'price': true, 'price--collapsed': this.collapsed }}>
            {!!checkoutState.checkout?.total_savings_amount && (
              <sc-format-number
                class="total-price scratch-price"
                type="currency"
                value={-checkoutState.checkout?.total_savings_amount + checkoutState.checkout?.total_amount}
                currency={checkoutState.checkout?.currency || 'usd'}
              />
            )}
            <sc-total class="total-price" total={'total'}></sc-total>
          </span>
        )}
      </sc-line-item>
    );
  }

  @Watch('collapsed')
  async handleOpenChange() {
    if (!this.collapsed) {
      this.scShow.emit();
      await stopAnimations(this.body);
      this.body.hidden = false;
      this.body.style.overflow = 'hidden';
      const { keyframes, options } = getAnimation(this.el, 'summary.show');
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.style.height = 'auto';
      this.body.style.overflow = 'visible';
    } else {
      this.scHide.emit();
      await stopAnimations(this.body);
      this.body.style.overflow = 'hidden';
      const { keyframes, options } = getAnimation(this.el, 'summary.hide');
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.hidden = true;
      this.body.style.height = 'auto';
      this.body.style.overflow = 'visible';
    }
  }

  render() {
    return (
      <div class={{ 'summary': true, 'summary--open': !this.collapsed }}>
        {this.collapsible && this.renderHeader()}
        <div
          ref={el => (this.body = el as HTMLElement)}
          class={{
            'summary__content': true,
            'summary__content--empty': this.empty() && !formBusy(),
          }}
        >
          <slot />
        </div>
        {this.empty() && !formBusy() && <p class="empty">{__('Your cart is empty.', 'surecart')}</p>}
      </div>
    );
  }
}

setDefaultAnimation('summary.show', {
  keyframes: [
    { height: '0', opacity: '0' },
    { height: 'auto', opacity: '1' },
  ],
  options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('summary.hide', {
  keyframes: [
    { height: 'auto', opacity: '1' },
    { height: '0', opacity: '0' },
  ],
  options: { duration: 250, easing: 'ease' },
});

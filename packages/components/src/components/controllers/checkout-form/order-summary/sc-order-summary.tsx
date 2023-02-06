import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { animateTo, shimKeyframesHeightAuto, stopAnimations } from '../../../../functions/animate';
import { getAnimation, setDefaultAnimation } from '../../../../functions/animation-registry';
import { Checkout } from '../../../../types';

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
  @Prop() empty: boolean;
  @Prop() closedText: string = __('Show Summary', 'surecart');
  @Prop() openText: string = __('Summary', 'surecart');
  @Prop() collapsible: boolean = false;
  @Prop() collapsedOnMobile: boolean = false;
  @Prop({ mutable: true }) collapsed: boolean;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  /** Show the toggle */
  @Event() scHide: EventEmitter<void>;

  componentWillLoad() {
    if (this.collapsedOnMobile) {
      const bodyRect = document.body.getClientRects();
      if (bodyRect.length) this.collapsed = bodyRect[0]?.width < 781;
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (this.empty && !this.busy) return;
    this.collapsed = !this.collapsed;
  }

  renderHeader() {
    // busy state
    if (this.busy && !this.order?.line_items?.data?.length) {
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
        <span class="collapse-link" slot="title" onClick={e => this.handleClick(e)}>
          {this.collapsed ? this.closedText : this.openText}
          <svg xmlns="http://www.w3.org/2000/svg" class="collapse-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        {this.collapsed && (
          <span slot="price">
            {!!this.order?.total_savings_amount && (
              <sc-format-number
                class="scratch-price"
                type="currency"
                value={-this.order?.total_savings_amount + this.order?.total_amount}
                currency={this.order?.currency || 'usd'}
              />
            )}
            <sc-total total={'total'} order={this.order}></sc-total>
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
            'summary__content--empty': this.empty && !this.busy,
          }}
        >
          <slot />
        </div>
        {this.empty && !this.busy && <p class="empty">{__('Your cart is empty.', 'surecart')}</p>}
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

openWormhole(ScOrderSummary, ['order', 'busy', 'empty'], false);

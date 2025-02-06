import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
import { animateTo, shimKeyframesHeightAuto, stopAnimations } from '../../../functions/animate';
import { getAnimation, setDefaultAnimation } from '../../../functions/animation-registry';

@Component({
  tag: 'sc-summary',
  styleUrl: 'sc-summary.scss',
  shadow: true,
})
export class ScOrderSummary {
  private body: HTMLElement;
  @Element() el: HTMLScOrderSummaryElement;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() closedText: string = __('Show Summary', 'surecart');
  @Prop() openText: string = __('Summary', 'surecart');
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
    this.collapsed = !this.collapsed;
  }

  renderHeader() {
    // busy state
    if (this.loading) {
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
          aria-label={sprintf(__('Summary %s', 'surecart'), this.collapsed ? __('collapsed', 'surecart') : __('expanded', 'surecart'))}
          onKeyDown={e => {
            if (e.key === ' ') {
              this.handleClick(e);
              speak(sprintf(__('Summary %s', 'surecart'), this.collapsed ? __('collapsed', 'surecart') : __('expanded', 'surecart')), 'assertive');
            }
          }}
        >
          {this.collapsed ? this.closedText || __('Summary', 'surecart') : this.openText || __('Summary', 'surecart')}
          <svg xmlns="http://www.w3.org/2000/svg" class="collapse-link__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span slot="description">
          <slot name="description" />
        </span>

        <span slot="price" class={{ 'price': true, 'price--collapsed': this.collapsed }}>
          <slot name="price"></slot>
        </span>
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
            summary__content: true,
          }}
        >
          <slot />
        </div>
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

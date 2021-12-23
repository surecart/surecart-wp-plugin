import { Component, h, Element, Prop } from '@stencil/core';

@Component({
  tag: 'ce-heading',
  styleUrl: 'ce-heading.scss',
  shadow: true,
})
export class CeHeading {
  @Element() el: HTMLElement;
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';

  componentDidLoad() {
    // Set initial tab state when the tabs first become visible
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].intersectionRatio > 0) {
        observer.unobserve(entries[0].target);
      }
    });
    intersectionObserver.observe(this.el);
  }
  render() {
    return (
      <div
        class={{
          'heading': true,
          'heading--small': this.size === 'small',
          'heading--medium': this.size === 'medium',
          'heading--large': this.size === 'large',
        }}
        part="base"
      >
        <div class={{ heading__text: true }}>
          <div class="heading__title">
            <slot></slot>
          </div>
          <div class="heading__description">
            <slot name="description"></slot>
          </div>
        </div>
        <slot name="end"></slot>
      </div>
    );
  }
}

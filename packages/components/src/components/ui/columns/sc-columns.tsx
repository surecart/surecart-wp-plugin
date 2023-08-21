import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-columns',
  styleUrl: 'sc-columns.scss',
  shadow: false,
})
export class ScColumns {
  /**
   * The vertical alignment of the columns.
   */
  @Prop() verticalAlignment: string;
  /**
   * Is this stacked on mobile
   */
  @Prop() isStackedOnMobile: boolean;
  /**
   * Is this full vertical height
   */
  @Prop() isFullHeight: boolean;
  /**
   * Is this reverse ordered on mobile
   */
  @Prop() isReversedOnMobile: boolean;

  render() {
    return (
      <Host
        class={{
          'sc-columns': true,
          [`are-vertically-aligned-${this.verticalAlignment}`]: !!this.verticalAlignment,
          'is-not-stacked-on-mobile': !this.isStackedOnMobile,
          'is-full-height': !!this.isFullHeight,
          'is-reversed-on-mobile': !!this.isReversedOnMobile,
        }}
      >
        <slot />
      </Host>
    );
  }
}

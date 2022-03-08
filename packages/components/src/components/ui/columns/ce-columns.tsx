import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'ce-columns',
  styleUrl: 'ce-columns.scss',
  shadow: false,
})
export class CeColumns {
  /**
   * The vertical alignment of the columns.
   */
  @Prop() verticalAlignment: string;
  /**
   * Is this stacked on mobile
   */
  @Prop() isStackedOnMobile: boolean;

  render() {
    return (
      <Host
        class={{
          'ce-columns': true,
          [`are-vertically-aligned-${this.verticalAlignment}`]: !!this.verticalAlignment,
          'is-not-stacked-on-mobile': !!this.isStackedOnMobile,
        }}
      >
        <slot />
      </Host>
    );
  }
}

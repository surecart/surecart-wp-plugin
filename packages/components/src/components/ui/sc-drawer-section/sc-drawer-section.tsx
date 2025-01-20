import { Component, h, Prop, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-drawer-section',
  styleUrl: 'sc-drawer-section.scss',
  shadow: true,
})
export class ScDrawerSection {
  /** The product id. */
  @Prop() title: string;

  render() {
    return (
        <Host
            class="drawer-section"
        >
            {this.title && <h3>{__(this.title)}</h3>}
            <slot></slot>
        </Host>
    );
  }
}

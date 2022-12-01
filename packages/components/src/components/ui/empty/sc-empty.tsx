import { Component, h, Prop } from '@stencil/core';

/**
 * @part base - The elements base wrapper.
 * @part icon - The icon.
 */
@Component({
  tag: 'sc-empty',
  styleUrl: 'sc-empty.scss',
  shadow: true,
})
export class ScEmpty {
  @Prop() icon: string;

  render() {
    return (
      <div part="base" class="empty">
        {!!this.icon && <sc-icon exportparts="base:icon" name={this.icon}></sc-icon>}
        <slot></slot>
      </div>
    );
  }
}

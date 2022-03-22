import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sc-empty',
  styleUrl: 'sc-empty.scss',
  shadow: true,
})
export class ScEmpty {
  @Prop() icon: string;

  render() {
    return (
      <div class="empty">
        {!!this.icon && <sc-icon name={this.icon}></sc-icon>}
        <slot></slot>
      </div>
    );
  }
}

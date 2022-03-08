import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-empty',
  styleUrl: 'ce-empty.scss',
  shadow: true,
})
export class CeEmpty {
  @Prop() icon: string;

  render() {
    return (
      <div class="empty">
        {!!this.icon && <ce-icon name={this.icon}></ce-icon>}
        <slot></slot>
      </div>
    );
  }
}

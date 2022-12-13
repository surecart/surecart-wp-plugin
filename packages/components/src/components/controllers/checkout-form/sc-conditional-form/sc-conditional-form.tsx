import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-conditional-form',
  styleUrl: 'sc-conditional-form.css',
  shadow: true,
})
export class ScConditionalForm {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}

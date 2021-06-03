import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ce-form-section',
  styleUrl: 'ce-form-section.scss',
  shadow: true,
})
export class CEFormSection {
  @Prop() label: string;

  render() {
    return (
      <Host>
        <div class="section__label">
          <h3 class="section__title" part="title">
            <slot name="label">{this.label}</slot>
          </h3>
          <div class="section__description" part="description">
            <slot name="description"></slot>
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}

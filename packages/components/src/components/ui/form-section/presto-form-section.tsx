import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'presto-form-section',
  styleUrl: 'presto-form-section.scss',
  shadow: true,
})
export class PrestoFormSection {
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

import { Component, State, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'ce-form-section',
  styleUrl: 'ce-form-section.scss',
  shadow: true,
})
export class CEFormSection {
  @Element() el: HTMLCeFormSectionElement;

  @Prop() label: string;

  hasLabelSlot: boolean;
  hasDescriptionSlot: boolean;

  componentWillLoad() {
    this.hasLabelSlot = !!this.el.querySelector('[slot="label"]');
    this.hasDescriptionSlot = !!this.el.querySelector('[slot="description"]');
  }

  render() {
    return (
      <div
        class={{
          'section': true,
          'section--has-label': this.hasLabelSlot,
          'section--has-description': this.hasDescriptionSlot,
        }}
      >
        <div class="section__label">
          <h3 class="section__title" part="title">
            <slot name="label">{this.label}</slot>
          </h3>
          <div class="section__description" part="description">
            <slot name="description"></slot>
          </div>
        </div>
        <slot></slot>
      </div>
    );
  }
}

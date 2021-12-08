import { Component, h, Prop, Element, State, Listen } from '@stencil/core';

@Component({
  tag: 'ce-card',
  styleUrl: 'ce-card.scss',
  shadow: true,
})
export class CeCard {
  @Element() el!: HTMLCeCardElement;

  @Prop() borderless: boolean;

  @State() hasTitleSlot: boolean;

  componentWillLoad() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  @Listen('slotChange')
  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  render() {
    return (
      <div part="base" class={{ 'card': true, 'card--borderless': this.borderless, 'card--has-title-slot': this.hasTitleSlot }}>
        <div class="card--title">
          <slot name="title" />
          <ce-divider part="border" style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
        </div>
        <slot />
      </div>
    );
  }
}

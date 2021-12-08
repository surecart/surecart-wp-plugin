import { Component, h, Prop, Element, State } from '@stencil/core';

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
    this.handleSlotChange();
  }
  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'card': true,
          'card--borderless': this.borderless,
          'card--has-title-slot': this.hasTitleSlot,
        }}
      >
        <div class="card--title">
          <slot name="title" onSlotchange={() => this.handleSlotChange()} />
          <ce-divider class="title--divider" part="border" style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
        </div>
        <slot />
      </div>
    );
  }
}

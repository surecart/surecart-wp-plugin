import { Component, h, Prop, Element, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-card',
  styleUrl: 'ce-card.scss',
  shadow: true,
})
export class CeCard {
  @Element() el!: HTMLCeCardElement;

  /** Is this card borderless. */
  @Prop() borderless: boolean;
  /** Is this card loading. */
  @Prop() loading: boolean;

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
          {this.loading ? <ce-skeleton style={{ width: '120px' }}></ce-skeleton> : <slot name="title" onSlotchange={() => this.handleSlotChange()}></slot>}
          <ce-divider class="title--divider" part="border" style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
        </div>
        <slot />
      </div>
    );
  }
}

openWormhole(CeCard, ['loading'], false);

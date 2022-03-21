import { Component, h, Prop, Element, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-card',
  styleUrl: 'sc-card.scss',
  shadow: true,
})
export class ScCard {
  @Element() el!: HTMLScCardElement;
  /** Eliminate the divider */
  @Prop() noDivider: boolean;
  /** Is this card borderless. */
  @Prop() borderless: boolean;
  /** Remove padding */
  @Prop() noPadding: boolean;
  /** Is this card loading. */
  @Prop() loading: boolean;
  /** Does this have a title slot? */
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
          'card--no-padding': this.noPadding,
          // 'card--has-title-slot': this.hasTitleSlot,
        }}
      >
        {/* <div class="card--title">
          {this.loading ? <sc-skeleton style={{ width: '120px' }}></sc-skeleton> : <slot name="title" onSlotchange={() => this.handleSlotChange()}></slot>}
          {!this.noDivider && <sc-divider class="title--divider" part="border" style={{ '--spacing': 'var(--sc-spacing-small)' }}></sc-divider>}
        </div> */}
        <slot />
      </div>
    );
  }
}

openWormhole(ScCard, ['loading'], false);

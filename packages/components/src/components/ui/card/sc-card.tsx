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
  /** A link for the card. */
  @Prop() href: string;
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
    const Tag = this.href ? 'a' : 'div';
    return (
      <Tag
        part="base"
        class={{
          'card': true,
          'card--borderless': this.borderless,
          'card--no-padding': this.noPadding,
        }}
      >
        <slot />
      </Tag>
    );
  }
}

openWormhole(ScCard, ['loading'], false);

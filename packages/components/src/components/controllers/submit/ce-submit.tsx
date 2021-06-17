import { Component, h, Prop, Element } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
@Component({
  tag: 'ce-submit',
  shadow: false,
})
export class CeSubmit {
  @Element() host: HTMLDivElement;

  /** Is the button loading */
  @Prop() loading: boolean;

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'large';

  /** Draws the button full-width */
  @Prop({ reflect: true }) full?: boolean = true;

  /** Draws the button full-width */
  @Prop() text: string = '';

  render() {
    return (
      <ce-button loading={this.loading} disabled={this.loading} type="primary" submit full={this.full} size={this.size}>
        {this.text}
      </ce-button>
    );
  }
}

openWormhole(CeSubmit, ['loading']);

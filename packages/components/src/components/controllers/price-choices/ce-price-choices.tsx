import { Component, h, Prop, Fragment, Element } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  /** Selector label */
  @Prop() label: string;

  /** Number of columns */
  @Prop() columns: number = 1;

  /** Busy */
  @Prop() busy: boolean = false;

  /** Required by default */
  @Prop() required: boolean = true;

  render() {
    return (
      <Fragment>
        <ce-choices label={this.label} required={this.required} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
          <slot />
        </ce-choices>
        {this.busy && <ce-block-ui z-index={4}></ce-block-ui>}
      </Fragment>
    );
  }
}

openWormhole(CePriceChoices, ['busy']);

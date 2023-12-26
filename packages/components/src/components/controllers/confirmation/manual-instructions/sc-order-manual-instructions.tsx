import { Component, h, Host, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-manual-instructions',
  styleUrl: 'sc-order-manual-instructions.css',
  shadow: true,
})
export class ScOrderManualInstructions {
  @Prop() manualPaymentTitle: string;
  @Prop() manualPaymentInstructions: string;

  render() {
    if (!this.manualPaymentInstructions || !this.manualPaymentTitle) {
      return <Host style={{ display: 'none' }} />;
    }

    return (
      <sc-alert type="info" open>
        <span slot="title">{this.manualPaymentTitle}</span>
        <p innerHTML={this.manualPaymentInstructions}></p>
      </sc-alert>
    );
  }
}

openWormhole(ScOrderManualInstructions, ['manualPaymentTitle', 'manualPaymentInstructions'], false);

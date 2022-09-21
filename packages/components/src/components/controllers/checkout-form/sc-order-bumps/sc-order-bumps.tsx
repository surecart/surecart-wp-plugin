import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Bump, Checkout } from '../../../../types';

@Component({
  tag: 'sc-order-bumps',
  styleUrl: 'sc-order-bumps.scss',
  shadow: true,
})
export class ScOrderBumps {
  @Prop() label: string;
  @Prop() showControl: boolean;
  @Prop() help: string;
  @Prop() bumps: Bump[];
  @Prop() checkout: Checkout;

  render() {
    if (!this.bumps.length) {
      return null;
    }

    return (
      <sc-form-control label={this.label || __('Recommended', 'surecart')} help={this.help}>
        <div class="bumps__list">
          {(this.bumps || []).map(bump => (
            <sc-order-bump show-control={this.showControl} bump={bump} checkout={this.checkout}></sc-order-bump>
          ))}
        </div>
      </sc-form-control>
    );
  }
}

openWormhole(ScOrderBumps, ['bumps', 'checkout'], false);

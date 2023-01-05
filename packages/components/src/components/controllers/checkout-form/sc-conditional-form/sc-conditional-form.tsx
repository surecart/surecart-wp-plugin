import { Component, Host, h, Prop } from '@stencil/core';

import { openWormhole } from 'stencil-wormhole';

import { Checkout, ProcessorName } from '../../../../types';

import * as logic from './conditional-functions';

@Component({
  tag: 'sc-conditional-form',
  styleUrl: 'sc-conditional-form.css',
  shadow: true,
})

export class ScConditionalForm {
  /** Selector label */
  @Prop() rule_groups: object = [];

  /** Checkout Session from sc-checkout. */
  @Prop() checkout: Checkout;

   /** The currently selected processor */
  @Prop() selectedProcessorId: ProcessorName;


  render() {
    let show = logic.is_any_rule_group_passed( this.rule_groups, { checkout: this.checkout, processor: this.selectedProcessorId } );
    if ( ! show ) return null;
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}

openWormhole(ScConditionalForm, ['checkout', 'selectedProcessorId'], false);

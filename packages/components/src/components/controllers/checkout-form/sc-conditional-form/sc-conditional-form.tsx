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
  @Prop() rule_groups: string = '';

  /** Checkout Session from sc-checkout. */
  @Prop() checkout: Checkout;

   /** The currently selected processor */
  @Prop() selectedProcessorId: ProcessorName;


  render() {
    { console.log( 'this.selectedProcessorId' ) }
    { console.log( this.selectedProcessorId ) }

    let parsedRules = this.rule_groups ? JSON.parse( this.rule_groups ) : [];

    let show = logic.is_any_rule_group_passed( parsedRules, { checkout: this.checkout, processor: this.selectedProcessorId } );
    if ( ! show ) return null;
    return (
      <Host>
        <p>-------------- Temp divider start -------------------</p>
        <slot></slot>
        <p>-------------- Temp divider end -------------------</p>
      </Host>
    );
  }

}

openWormhole(ScConditionalForm, ['checkout', 'selectedProcessorId'], false);

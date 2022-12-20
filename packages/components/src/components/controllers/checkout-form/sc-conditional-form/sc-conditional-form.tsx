import { Component, Host, h, Prop } from '@stencil/core';

import { openWormhole } from 'stencil-wormhole';

import { Checkout } from '../../../../types';

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

  render() {
    // { console.log( 'this.checkout' ) }
    // { console.log( this.checkout ) }
    // // { console.log( this ) }
    // { console.log( 'this.props' ) }
    // { console.log( this.rule_groups ) }

    let parsedRules = this.rule_groups ? JSON.parse( this.rule_groups ) : [];

    // return null;
    let show = logic.is_any_rule_group_passed( parsedRules, this.checkout );
    if ( ! show ) return null;
    return (
      <Host>
        <p>Hello</p>
        <slot></slot>
      </Host>
    );
  }

}

openWormhole(ScConditionalForm, ['checkout'], false);

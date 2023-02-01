import { Component, Host, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Checkout, ProcessorName, RuleGroup } from '../../../../types';
import { hasAnyRuleGroupPassed } from './conditional-functions';

@Component({
  tag: 'sc-conditional-form',
  styleUrl: 'sc-conditional-form.css',
  shadow: true,
})
export class ScConditionalForm {
  /** Selector label */
  @Prop() rule_groups: RuleGroup[];

  /** Checkout Session from sc-checkout. */
  @Prop() checkout: Checkout;

  /** The currently selected processor */
  @Prop() selectedProcessorId: ProcessorName;

  render() {
    let show = hasAnyRuleGroupPassed(this.rule_groups, { checkout: this.checkout, processor: this.selectedProcessorId });
    if (!show) return null;
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

openWormhole(ScConditionalForm, ['checkout', 'selectedProcessorId'], false);

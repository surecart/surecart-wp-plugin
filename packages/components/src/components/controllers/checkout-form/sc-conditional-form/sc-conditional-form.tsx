import { Component, Host, h, Prop } from '@stencil/core';
import { RuleGroup } from '../../../../types';
import { hasAnyRuleGroupPassed } from './conditional-functions';
import { state as selectedProcessor } from '@store/selected-processor';
import { currentCheckout } from '@store/checkout/getters';

@Component({
  tag: 'sc-conditional-form',
  styleUrl: 'sc-conditional-form.css',
  shadow: true,
})
export class ScConditionalForm {
  /** Selector label */
  @Prop() rule_groups: RuleGroup[];

  render() {
    let show = hasAnyRuleGroupPassed(this.rule_groups, { checkout: currentCheckout(), processor: selectedProcessor?.id });
    if (!show) return null;
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

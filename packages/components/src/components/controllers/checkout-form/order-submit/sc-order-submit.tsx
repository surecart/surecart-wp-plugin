import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Processor } from '../../../../types';

@Component({
  tag: 'sc-order-submit',
  styleUrl: 'sc-order-submit.scss',
  shadow: false,
})
export class ScOrderSubmit {
  /** Is the order busy */
  @Prop() busy: boolean;

  /** Is the order loading. */
  @Prop() loading: boolean;

  /** Is the order paying. */
  @Prop() paying: boolean;

  /** The button type. */
  @Prop({ reflect: true }) type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | 'link' = 'primary';

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** Show a full-width button. */
  @Prop() full: boolean = true;

  /** Icon to show. */
  @Prop() icon: string;

  /** Show the total. */
  @Prop() showTotal: boolean;

  /** Keys and secrets for processors. */
  @Prop() processors: Processor[];

  @Prop() processor: 'stripe' | 'paypal';

  render() {
    if (this.processor === 'paypal') {
    }

    return (
      <sc-button submit type={this.type} size={this.size} full={this.full} loading={this.loading || this.paying} disabled={this.loading || this.paying || this.busy}>
        {!!this.icon && <sc-icon name={this.icon} slot="prefix"></sc-icon>}
        <slot />
        {this.showTotal && (
          <span>
            {'\u00A0'}
            <sc-total></sc-total>
          </span>
        )}
      </sc-button>
    );
  }
}
openWormhole(ScOrderSubmit, ['busy', 'loading', 'paying', 'processors', 'processor'], false);

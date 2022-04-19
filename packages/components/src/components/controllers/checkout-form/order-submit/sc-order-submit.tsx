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

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Keys and secrets for processors. */
  @Prop() processors: Processor[];

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  @Prop() processor: 'stripe' | 'paypal';

  render() {
    console.log(this.processor);
    if (this.processor === 'paypal') {
      const clientId = (this?.processors || []).find(processor => processor?.processor_type === 'paypal' && processor?.live_mode === !!(this.mode === 'live'))?.processor_data
        ?.client_id;
      if (clientId) {
        return (
          <sc-paypal-buttons mode={this.mode} currency-code={this.currencyCode} client-id={clientId}>
            <slot />
          </sc-paypal-buttons>
        );
      }
      return (
        /** Need to return the slot so slot content doesn't show. */
        <div hidden>
          <slot />
        </div>
      );
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
openWormhole(ScOrderSubmit, ['busy', 'loading', 'paying', 'processors', 'processor', 'mode', 'currencyCode'], false);

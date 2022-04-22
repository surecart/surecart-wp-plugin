import { Component, Fragment, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { getProcessorData } from '../../../../functions/processor';
import { Order, Processor } from '../../../../types';

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

  /** The current order. */
  @Prop() order: Order;

  /** Currency Code */
  @Prop() currencyCode: string = 'usd';

  @Prop() processor: 'stripe' | 'paypal' | 'paypal-card';

  renderPayPalButton(buttons) {
    const { client_id, account_id } = getProcessorData(this.processors, 'paypal', this.mode);
    if (!client_id && !account_id) return null;

    return (
      <sc-paypal-buttons
        buttons={buttons}
        busy={this.busy}
        mode={this.mode}
        order={this.order}
        currency-code={this.currencyCode}
        client-id={client_id}
        merchant-id={account_id}
        label="checkout"
        color="blue"
      ></sc-paypal-buttons>
    );
  }

  render() {
    return (
      <Fragment>
        {this.processor === 'paypal' && this.renderPayPalButton(['paypal'])}
        {this.processor === 'paypal-card' && this.renderPayPalButton(['card'])}
        <sc-button
          hidden={this.processor !== 'stripe'}
          submit
          type={this.type}
          size={this.size}
          full={this.full}
          loading={this.loading || this.paying}
          disabled={this.loading || this.paying || this.busy}
        >
          {!!this.icon && <sc-icon name={this.icon} slot="prefix"></sc-icon>}
          <slot />
          {this.showTotal && (
            <span>
              {'\u00A0'}
              <sc-total></sc-total>
            </span>
          )}
        </sc-button>
      </Fragment>
    );
  }
}
openWormhole(ScOrderSubmit, ['busy', 'loading', 'paying', 'processors', 'processor', 'mode', 'currencyCode', 'order'], false);

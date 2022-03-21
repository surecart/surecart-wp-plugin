import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-submit',
  styleUrl: 'ce-order-submit.scss',
  shadow: false,
})
export class CeOrderSubmit {
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

  render() {
    return (
      <ce-button submit type={this.type} size={this.size} full={this.full} loading={this.loading || this.paying} disabled={this.loading || this.paying || this.busy}>
        {!!this.icon && <ce-icon name={this.icon} slot="prefix"></ce-icon>}
        <slot />
        {this.showTotal && (
          <span>
            {'\u00A0'}
            <ce-total></ce-total>
          </span>
        )}
      </ce-button>
    );
  }
}
openWormhole(CeOrderSubmit, ['busy', 'loading', 'paying'], false);

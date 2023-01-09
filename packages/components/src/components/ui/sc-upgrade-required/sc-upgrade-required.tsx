import { Component, h, Host, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.scss',
  shadow: true,
})
export class ScUpgradeRequired {
  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'small';

  @Prop({ reflect: true }) required: boolean = true;

  @State() open: boolean = false;

  render() {
    if (!this.required) {
      return (
        <Host>
          <slot />
        </Host>
      );
    }

    return (
      <Host>
        <span class="trigger" onClick={() => (this.open = true)}>
          <slot>
            <sc-premium-badge />
          </slot>
        </span>
        <sc-dialog
          label={__('Boost Your Revenue', 'surecart')}
          open={this.open}
          onScRequestClose={() => (this.open = false)}
          style={{ '--width': '21rem', 'fontSize': '15px', '--body-spacing': '2rem' }}
        >
          <span class="dialog__title" slot="label">
            <sc-icon name="zap"></sc-icon>
            <span>{__('Boost Your Revenue', 'surecart')}</span>
          </span>
          <p>{__('Unlock revenue boosting features when you upgrade your plan!', 'surecart')}</p>
          <sc-button href="https://app.surecart.com/billing" type="primary" target="_blank" full>
            {__('Upgrade Now', 'surecart')}
            <sc-icon name="arrow-right" slot="suffix" />
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}

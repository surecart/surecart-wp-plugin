import { Component, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-upgrade-required',
  styleUrl: 'sc-upgrade-required.scss',
  shadow: true,
})
export class ScUpgradeRequired {
  /** The tag's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'small';

  /** Is this required? */
  @Prop({ reflect: true }) required: boolean = true;

  /** Whether to render upgrade modal by default */
  @Prop({ mutable: true }) open: boolean = false;

  render() {
    if (!this.required) {
      return (
        <Host>
          <slot />
        </Host>
      );
    }

    return (
      <Host onClick={() => (this.open = true)}>
        <span class="trigger">
          <span class="trigger__disabled">
            <slot>
              <sc-premium-badge />
            </slot>
          </span>
        </span>
        <sc-dialog
          label={__('Boost Your Revenue', 'surecart')}
          open={this.open}
          onScRequestClose={() => {
            this.open = false;
            return true;
          }}
          style={{ '--width': '21rem', 'fontSize': '15px', '--body-spacing': '2rem' }}
        >
          <span class="dialog__title" slot="label">
            <sc-icon name="zap"></sc-icon>
            <span>{__('Boost Your Revenue', 'surecart')}</span>
          </span>
          <slot name="content">
            <p>{__('Unlock revenue boosting features when you upgrade your plan!', 'surecart')}</p>
          </slot>
          <sc-button href="https://app.surecart.com/billing" type="primary" target="_blank" full>
            {__('Upgrade Now', 'surecart')}
            <sc-icon name="arrow-right" slot="suffix" />
          </sc-button>
        </sc-dialog>
      </Host>
    );
  }
}

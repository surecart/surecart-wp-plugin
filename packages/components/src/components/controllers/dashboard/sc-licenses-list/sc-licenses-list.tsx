import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Activation, License } from '../../../../types';

@Component({
  tag: 'sc-licenses-list',
  styleUrl: 'sc-licenses-list.css',
  shadow: true,
})
export class ScLicensesList {
  @Prop() licenses: License[] = [];
  @Prop() activations: Activation[] = [];
  @Prop() heading: string;
  @Prop() copied: boolean;

  renderStatus(status) {
		if (status === 'active') {
			return <sc-tag type="success">{__('Active', 'surecart')}</sc-tag>;
		}
		if (status === 'revoked') {
			return <sc-tag type="danger">{__('Revoked', 'surecart')}</sc-tag>;
		}
		if (status === 'inactive') {
			return <sc-tag type="info">{__('Inactive', 'surecart')}</sc-tag>;
		}

		return <sc-tag type="info">{status}</sc-tag>;
  }

  async copyKey(key: string) {
      try {
        await navigator.clipboard.writeText(key);
        this.copied = true;

        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (err) {
        console.error(err);
        alert(__('Error copying to clipboard', 'surecart'));
      }
  }

  render() {
    return (
      <sc-dashboard-module class="purchase" part="base">
        <span slot="heading">
          <slot name="heading">{this.heading || __('License Keys', 'surecart')}</slot>
        </span>
        <sc-card no-padding>
          <sc-table>
            <sc-table-cell slot="head">{__('Key', 'surecart')}</sc-table-cell>
            <sc-table-cell slot="head" style={{width: '100px'}}>{__('Status', 'surecart')}</sc-table-cell>
            <sc-table-cell slot="head" style={{width: '100px'}}>{__('Activations', 'surecart')}</sc-table-cell>
            {this.licenses.map(({key, status, activations, activation_limit})=> {
              return <sc-table-row style={{ '--columns': '3' }}>
                <sc-table-cell>
                  <sc-input value={key} readonly>
                    <sc-button type="default" size="small" slot="suffix" onClick={() => this.copyKey(key)}>{this.copied ? __('Copied!', 'surecart') : __('Copy', 'surecart')}</sc-button>
                  </sc-input>
                </sc-table-cell>
                <sc-table-cell>{this.renderStatus(status)}</sc-table-cell>
                <sc-table-cell>{activations?.pagination?.count} / {activation_limit || <span>&infin;</span>}</sc-table-cell>
              </sc-table-row>
            })}
          </sc-table>
        </sc-card>
      </sc-dashboard-module>
    );
  }
}

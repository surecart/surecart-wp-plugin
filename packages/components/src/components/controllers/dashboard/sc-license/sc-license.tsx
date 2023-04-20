import { Component, Element, Fragment, Prop, State, h } from '@stencil/core';
import { onFirstVisible } from '../../../../functions/lazy';
import { License } from 'src/types';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-license',
  styleUrl: 'sc-license.scss',
  shadow: true,
})
export class ScLicense {
  @Element() el: HTMLScLicenseElement;

  /**The license id */
  @Prop() licenseId: string;

  @State() loading: boolean = false;
  @State() error: string = '';
  @State() license: License;
  @State() copied: boolean = false;
  @State() showConfirmDelete: boolean = false;
  @State() selectedActivationId: string = '';
  @State() deleteActivationError: string = '';
  @State() busy: boolean = false;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getLicense();
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async getLicense() {
    this.license = await apiFetch({
      path: addQueryArgs(`surecart/v1/licenses/${this.licenseId}`, {
        expand: ['activations'],
      }),
    });
  }

  deleteActivation = async () => {
    try {
      this.busy = true;
      await apiFetch({
        path: `surecart/v1/activations/${this.selectedActivationId}`,
        method: 'DELETE',
      });
      this.onCloseDeleteModal();
      await this.initialFetch();
    } catch (e) {
      console.error(e);
      this.deleteActivationError = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  };

  async copyKey() {
    try {
      await navigator.clipboard.writeText(this.license?.key);
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(__('Error copying to clipboard', 'surecart'));
    }
  }

  renderStatus() {
    if (this.license?.status === 'active') {
      return <sc-tag type="success">{__('Active', 'surecart')}</sc-tag>;
    }
    if (this.license?.status === 'revoked') {
      return <sc-tag type="danger">{__('Revoked', 'surecart')}</sc-tag>;
    }
    if (this.license?.status === 'inactive') {
      return <sc-tag type="info">{__('Inactive', 'surecart')}</sc-tag>;
    }

    return <sc-tag type="info">{this.license?.status}</sc-tag>;
  }

  renderLoading() {
    return (
      <sc-flex flexDirection="column" style={{ gap: '1em' }}>
        <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
      </sc-flex>
    );
  }

  renderEmpty() {
    return <sc-empty icon='activity'>{__('License not found.', 'surecart')}</sc-empty>;
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.license?.id) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        <sc-dashboard-module error={this.error}>
          <sc-card noPadding>
            <sc-stacked-list>
              <sc-stacked-list-row style={{ '--columns': '2' }}>
                <div>{__('Status', 'surecart')}</div>
                {this.renderStatus()}
              </sc-stacked-list-row>

              <sc-stacked-list-row style={{ '--columns': '2' }}>
                <div>{__('Activations', 'surecart')}</div>
                {this.license?.activations?.pagination?.count} / {this.license?.activation_limit || <span>&infin;</span>}
              </sc-stacked-list-row>
              <sc-stacked-list-row style={{ '--columns': '2' }}>
                <div>{__('Key', 'surecart')}</div>
                <sc-input value={this.license?.key} readonly>
                  <sc-button type="default" size="small" slot="suffix" onClick={() => this.copyKey()}>
                    {this.copied ? __('Copied!', 'surecart') : __('Copy', 'surecart')}
                  </sc-button>
                </sc-input>
              </sc-stacked-list-row>
            </sc-stacked-list>
          </sc-card>
        </sc-dashboard-module>
        <sc-dashboard-module>
          <span slot="heading">
            <slot name="heading">{__('Activations', 'surecart')}</slot>
          </span>
          <sc-card noPadding>
            {!!this.license?.activations?.data?.length ?(
              <sc-stacked-list>
                {this.license?.activations.data.map(activation => (
                  <sc-stacked-list-row style={{ '--columns': '3' }}>
                    <div>{activation.name}</div>
                    <div>{activation.fingerprint}</div>
                    <div>
                      <sc-button
                        onClick={() => {
                          this.selectedActivationId = activation.id;
                          this.showConfirmDelete = true;
                        }}
                      >
                        <sc-icon name="trash"></sc-icon>
                      </sc-button>
                    </div>
                  </sc-stacked-list-row>
                ))}
              </sc-stacked-list>
            ):<sc-empty>{__('No activations present.', 'surecart')}</sc-empty>}
          </sc-card>
        </sc-dashboard-module>
      </Fragment>
    );
  }

  onCloseDeleteModal = () => {
    this.selectedActivationId = '';
    this.showConfirmDelete = false;
    this.busy = false;
    this.deleteActivationError = '';
  };

  renderConfirmDelete() {
    return (
      <sc-dialog open={this.showConfirmDelete} style={{ '--body-spacing': 'var(--sc-spacing-x-large)' }} noHeader onScRequestClose={this.onCloseDeleteModal}>
        <sc-dashboard-module heading={__('Confirm', 'surecart')} style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}>
          <span slot="description">{__('Are you sure you want to delete activation?', 'surecart')}</span>
        </sc-dashboard-module>
        <div slot="footer">
          <sc-button type="text" onClick={this.onCloseDeleteModal} disabled={this.loading}>
            {__("Don't delete", 'surecart')}
          </sc-button>
          <sc-button type="primary" onClick={this.deleteActivation} disabled={this.loading}>
            {__('Delete activation', 'surecart')}
          </sc-button>
        </div>
        {this.busy && <sc-block-ui style={{ '--sc-block-ui-opacity': '0.75' }} spinner />}
      </sc-dialog>
    );
  }

  render() {
    return (
      <sc-spacing style={{ '--spacing': 'var(--sc-spacing-large)' }}>
        {this.renderContent()}
        {this.renderConfirmDelete()}
      </sc-spacing>
    );
  }
}

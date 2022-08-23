import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-dashboard-module',
  styleUrl: 'sc-dashboard-module.scss',
  shadow: true,
})
export class ScDashboardModule {
  @Prop() heading: string;
  @Prop() theme: string;
  @Prop() error: string;
  @Prop() loading: boolean;

  render() {
    console.log('SC D Data:');
    console.log(this);
    return (
      <div class="dashboard-module" data-theme={this.theme}>
        {!!this.error && (
          <sc-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}

        <div class="heading">
          <div class="heading__text">
            <div class="heading__title" part="heading-title">
              <slot name="heading">{this.heading}</slot>
            </div>
            <div class="heading__description" part="heading-description">
              <slot name="description"></slot>
            </div>
          </div>
          <slot name="end"></slot>
        </div>

        <slot></slot>
      </div>
    );
  }
}

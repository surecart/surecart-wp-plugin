import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-dashboard-module',
  styleUrl: 'ce-dashboard-module.scss',
  shadow: true,
})
export class CeDashboardModule {
  @Prop() heading: string;
  @Prop() error: string;

  render() {
    return (
      <div class="dashboard-module">
        {!!this.error && (
          <ce-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecartan>
            {this.error}
          </ce-alert>
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

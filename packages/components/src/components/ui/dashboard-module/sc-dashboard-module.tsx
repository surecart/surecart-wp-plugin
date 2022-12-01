import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * @part base - The elements base wrapper.
 * @part heading - The heading.
 * @part heading-text - The heading text wrapper.
 * @part heading-title - The heading title.
 * @part heading-description - The heading description.
 * @part error__base - The alert base wrapper.
 * @part error__icon - The alert icon.
 * @part error__text - The alert text.
 * @part error__title - The alert title.
 * @part error__ message - The alert message.
 */
@Component({
  tag: 'sc-dashboard-module',
  styleUrl: 'sc-dashboard-module.scss',
  shadow: true,
})
export class ScDashboardModule {
  @Prop() heading: string;
  @Prop() error: string;
  @Prop() loading: boolean;

  render() {
    return (
      <div class="dashboard-module" part="base">
        {!!this.error && (
          <sc-alert exportparts="base:error__base, icon:error__icon, text:error__text, title:error__title, message:error__message" open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}

        <div class="heading" part="heading">
          <div class="heading__text" part="heading-text">
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

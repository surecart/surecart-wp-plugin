/**
 * External dependencies.
 */
import { Component, h, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-form-error-provider',
  shadow: true,
})
export class ScFormErrorProvider {
  /** The element. */
  @Element() el: HTMLScFormErrorProviderElement;

  componentWillLoad() {
    this.maybeAddErrorsComponent();
  }

  maybeAddErrorsComponent() {
    if (!!this.el.querySelector('sc-checkout-form-errors')) return;
    const errorsComponent = document.createElement('sc-checkout-form-errors');
    this.el.querySelector('sc-form')?.prepend?.(errorsComponent);
  }

  render() {
    return <slot />;
  }
}

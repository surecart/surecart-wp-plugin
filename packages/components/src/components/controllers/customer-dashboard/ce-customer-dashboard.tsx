import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Universe } from 'stencil-wormhole';
import { createRouter, Route, href } from 'stencil-router-v2';

const Router = createRouter({
  parseURL: url => url.hash.slice(1),
  serializeURL: path => {
    return new URL(path);
  },
});

@Component({
  tag: 'ce-customer-dashboard',
  styleUrl: 'ce-customer-dashboard.css',
  shadow: true,
})
export class CeCustomerDashboard {
  /** Pass the current customer id. */
  @Prop() customerId: string;

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());
  }

  state() {
    return {
      customerId: this.customerId,
      orders: [],
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <ce-tab-group>
          <ce-tab slot="nav" {...href('#orders')} active={Router.activePath === 'orders'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {__('Orders', 'checkout_engine')}
          </ce-tab>
          <ce-tab slot="nav" {...href('#subscriptions')} active={Router.activePath === 'subscriptions'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {__('Subscriptions', 'checkout_engine')}
          </ce-tab>

          <ce-tab slot="nav" {...href('#charges')} active={Router.activePath === 'charges'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Charges
          </ce-tab>

          <ce-tab slot="nav" {...href('#refunds')} active={Router.activePath === 'refunds'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
            Refunds
          </ce-tab>

          <ce-tab slot="nav" {...href('#payment-methods')} active={Router.activePath === 'payment-methods'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Payment Methods
          </ce-tab>

          <ce-tab slot="nav" {...href('#account')} active={Router.activePath === 'charges'}>
            <svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Account Details
          </ce-tab>

          <Router.Switch>
            <Route path="orders">
              <ce-heading>{__('Orders', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
              <ce-customer-orders></ce-customer-orders>
            </Route>
            <Route path="subscriptions">
              <ce-heading>{__('Subscriptions', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
            </Route>
            <Route path="charges">
              <ce-heading>{__('Charges', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
            </Route>
            <Route path="refunds">
              <ce-heading>{__('Refunds', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
            </Route>
            <Route path="payment-methods">
              <ce-heading>{__('Payment Methods', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
            </Route>
            <Route path="account">
              <ce-heading>{__('Account Details', 'ce-customer-dashboard')}</ce-heading>
              <ce-divider style={{ '--spacing': 'var(--ce-spacing-medium)' }}></ce-divider>
            </Route>
          </Router.Switch>

          <slot></slot>
        </ce-tab-group>
      </Universe.Provider>
    );
  }
}

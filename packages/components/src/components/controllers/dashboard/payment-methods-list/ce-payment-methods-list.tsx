import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { PaymentMethod } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-payment-methods-list',
  styleUrl: 'ce-payment-methods-list.scss',
  shadow: true,
})
export class CePaymentMethodsList {
  @Element() el: HTMLCePaymentMethodsListElement;
  /** Query to fetch paymentMethods */
  @Prop() query: object;
  @Prop() listTitle: string;

  @State() paymentMethods: Array<PaymentMethod> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getPaymentMethods();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all paymentMethods */
  async getPaymentMethods() {
    try {
      this.loading = true;
      this.paymentMethods = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/payment_methods/`, {
          expand: ['card', 'customer'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderEmpty() {
    return <slot name="empty">{__('You have no saved payment methods.', 'checkout_engine')}</slot>;
  }

  renderLoading() {
    return (
      <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      </ce-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.paymentMethods?.length === 0) {
      return this.renderEmpty();
    }

    return this.paymentMethods.map(paymentMethod => {
      const { id, card, customer, live_mode } = paymentMethod;
      return (
        <ce-stacked-list-row
          // href={addQueryArgs(window.location.href, {
          //   action: 'show',
          //   model: 'payment_method',
          //   id,
          // })}
          style={{ '--columns': '4' }}
          mobile-size={0}
        >
          <ce-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
            <ce-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></ce-cc-logo>
            <span style={{ fontSize: '7px', whiteSpace: 'nowrap' }}>
              {'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
            </span>
            <span>{card?.last4}</span>
          </ce-flex>

          <div>
            {__('Exp.', 'checkout_engine')} {card?.exp_month}/{card?.exp_year}
          </div>

          <div>
            {typeof customer !== 'string' && customer?.default_payment_method === id && <ce-tag type="info">{__('Default', 'checkout_engine')}</ce-tag>}
            {!live_mode && <ce-tag type="warning">{__('Test', 'checkout_engine')}</ce-tag>}
          </div>

          <div>
            <ce-dropdown position="bottom-right">
              <ce-icon name="more-horizontal" slot="trigger" onClick={e => e.preventDefault()}></ce-icon>
              <ce-menu>
                <ce-menu-item>{__('Make Default', 'checkout_engine')}</ce-menu-item>
                <ce-menu-item>{__('Remove', 'checkout_engine')}</ce-menu-item>
              </ce-menu>
            </ce-dropdown>
          </div>
        </ce-stacked-list-row>
      );
    });
  }

  render() {
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    return (
      <div
        class={{
          'payment-methods-list': true,
        }}
      >
        <ce-heading>
          {this.listTitle || __('Payment Methods', 'checkout_engine')}
          <ce-flex slot="end">
            <a
              href={addQueryArgs(window.location.href, {
                action: 'index',
                model: 'charge',
              })}
            >
              <ce-icon name="clock"></ce-icon> {__('Payment History', 'checkout_engine')}
            </a>
            <a
              href={addQueryArgs(window.location.href, {
                action: 'create',
                model: 'payment_method',
              })}
            >
              <ce-icon name="plus"></ce-icon> {__('Add', 'checkout_engine')}
            </a>
          </ce-flex>
        </ce-heading>

        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </div>
    );
  }
}

// render() {
//   if (this.error) {
//     return (
//       <ce-alert open type="danger">
//         <span slot="title">{__('Error', 'checkout_engine')}</span>
//         {this.error}
//       </ce-alert>
//     );
//   }

//   return (
//     <div
//       class={{
//         'payment_methods-list': true,
//       }}
//     >
//       {this.listTitle && (
//         <ce-heading>
//           {this.listTitle || __('Subscriptions', 'checkout_engine')}
//           <a href="#" slot="end">
//             {__('View all', 'checkout_engine')} <ce-icon name="chevron-right"></ce-icon>
//           </a>
//         </ce-heading>
//       )}
//       <ce-card no-padding style={{ '--overflow': 'hidden' }}>
//         <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
//       </ce-card>
//     </div>
//   );
// }

// renderContent() {
//   if (this.loading) {
//     return (
//       <ce-table-row>
//         {[...Array(4)].map(() => (
//           <ce-table-cell>
//             <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
//           </ce-table-cell>
//         ))}
//       </ce-table-row>
//     );
//   }

//   return (this.paymentMethods || []).map(paymentMethod => {
//     const { id, card, created_at, processor_type } = paymentMethod;
//     return (
//       <ce-table-row>
//         <ce-table-cell>{__('Card', 'checkout_engine')}</ce-table-cell>
//         <ce-table-cell>
//           {typeof processor_type !== 'string' && (
//             <ce-flex justify-content="flex-start" style={{ '--spacing': '1em' }}>
//               <ce-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></ce-cc-logo>
//               **** {card?.last4}
//             </ce-flex>
//           )}
//         </ce-table-cell>
//         <ce-table-cell>
//           <ce-format-date date={created_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
//         </ce-table-cell>
//         <ce-table-cell>
//           <ce-button
//             href={addQueryArgs(window.location.href, {
//               paymentMethod: {
//                 id,
//               },
//             })}
//             size="small"
//           >
//             {__('Remove', 'checkout_engine')}
//           </ce-button>
//         </ce-table-cell>
//       </ce-table-row>
//     );
//   });
// }

// render() {
//   if (this.error) {
//     return (
//       <ce-alert open type="danger">
//         <span slot="title">{__('Error', 'checkout_engine')}</span>
//         {this.error}
//       </ce-alert>
//     );
//   }

//   if (!this.loading && !this?.paymentMethods?.length) {
//     return (
//       <ce-card borderless no-divider>
//         <span slot="title">
//           <slot name="title" />
//         </span>
//         <slot name="empty">{__('You have no payments.', 'checkout_engine')}</slot>
//       </ce-card>
//     );
//   }

//   return (
//     <ce-card borderless no-divider>
//       <span slot="title">
//         <slot name="title" />
//       </span>
//       <ce-table>
//         <ce-table-cell slot="head">{__('Type', 'checkout_engine')}</ce-table-cell>
//         <ce-table-cell slot="head">{__('Details', 'checkout_engine')}</ce-table-cell>
//         <ce-table-cell slot="head">{__('Added', 'checkout_engine')}</ce-table-cell>
//         <ce-table-cell slot="head" style={{ width: '100px' }}></ce-table-cell>

//         {this.renderContent()}
//       </ce-table>
//     </ce-card>
//   );
// }
// }

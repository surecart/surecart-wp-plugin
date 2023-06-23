import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
import { Fulfillment, Product } from 'src/types';

@Component({
  tag: 'sc-fulfillments',
  styleUrl: 'sc-fulfillments.scss',
  shadow: true,
})
export class ScFulfillments {
  @Element() el: HTMLScFulfillmentsElement;

  @Prop() orderId: string;
  @Prop() heading: string;

  /** Holds fulfillments. */
  @State() fulfillments: Fulfillment[];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  componentDidLoad() {
    console.log('load');
    this.fetch();
  }

  async fetch() {
    try {
      this.busy = true;
      this.fulfillments = (await apiFetch({
        path: addQueryArgs(`surecart/v1/fulfillments`, {
          expand: ['trackings', 'fulfillment_items', 'fulfillment_item.line_item', 'line_item.price', 'price.product'],
          order_ids: [this.orderId],
        }),
      })) as Fulfillment[];
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
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

  render() {
    if (this.loading || !this.fulfillments?.length) return <Host style={{ display: 'none' }}></Host>;

    return (
      <sc-spacing style={{ '--spacing': 'var(--sc-spacing-large)' }}>
        <sc-dashboard-module error={this.error}>
          <span slot="heading">{this.heading || _n('Shipment', 'Shipments', this.fulfillments?.length, 'surecart')}</span>
          {this.fulfillments.map(fulfillment => (
            <sc-card noPadding>
              <sc-stacked-list>
                <sc-stacked-list-row>
                  <div class="fulfillment__header">
                    <sc-fulfillment-shipping-status-badge status={fulfillment.shipping_status} />
                    <div class="fulfillment__number">#{fulfillment?.number}</div>
                  </div>
                </sc-stacked-list-row>

                {!!fulfillment?.trackings?.data?.length && (
                  <sc-stacked-list-row>
                    <div class="trackings">
                      <sc-icon name="truck" />
                      <div class="trackings__details">
                        <div class="trackings__title">{_n('Tracking number', 'Tracking numbers', fulfillment?.trackings?.data?.length, 'surecart')}</div>
                        <div class="trackings__list">
                          {(fulfillment?.trackings?.data || []).map(({ courier_name, number, url }) => (
                            <a href={url} target="_blank">
                              {number}
                              {!!courier_name && ` (${courier_name})`}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </sc-stacked-list-row>
                )}

                {(fulfillment?.fulfillment_items?.data || []).map(({ id, line_item, quantity }) => {
                  return (
                    <sc-stacked-list-row key={id} style={{ '--columns': '2' }}>
                      <div>
                        <div class="line_item__info">
                          <div class="line_item__image">
                            {!!(line_item?.price?.product as Product)?.image_url && <img src={(line_item?.price?.product as Product)?.image_url} />}
                          </div>
                          <div class="line_item__text">
                            <div>{(line_item?.price?.product as Product)?.name}</div>
                            <div>
                              <sc-format-number type="unit" value={(line_item?.price?.product as Product)?.weight} unit={(line_item?.price?.product as Product)?.weight_unit} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span>{sprintf(__('Qty: %d', 'surecart'), quantity || 0)}</span>
                    </sc-stacked-list-row>
                  );
                })}
              </sc-stacked-list>
            </sc-card>
            // <sc-card>
            //   <div class="fulfillment">
            //     <div class="fulfillment__header">
            //       <sc-fulfillment-shipping-status-badge status={fulfillment.shipping_status} />
            //       <div class="fulfillment__number">#{fulfillment?.number}</div>
            //     </div>

            //     {!!fulfillment?.trackings?.data?.length && (
            //       <div class="trackings">
            //         <sc-icon name="truck" />
            //         <div class="trackings__details">
            //           <div class="trackings__title">{_n('Tracking number', 'Tracking numbers', fulfillment?.trackings?.data?.length, 'surecart')}</div>
            //           <div class="trackings__list">
            //             {(fulfillment?.trackings?.data || []).map(({ courier_name, number, url }) => (
            //               <a href={url} target="_blank">
            //                 {number}
            //                 {!!courier_name && ` (${courier_name})`}
            //               </a>
            //             ))}
            //           </div>
            //         </div>
            //       </div>
            //     )}

            //     <div class="line_items">
            //       {(fulfillment?.fulfillment_items?.data || []).map(({ id, line_item, quantity }) => {
            //         return (
            //           <sc-line-item key={id}>
            //             <div slot="title">
            //               <div class="line_item__info">
            //                 <div class="line_item__image">
            //                   {!!(line_item?.price?.product as Product)?.image_url && <img src={(line_item?.price?.product as Product)?.image_url} />}
            //                 </div>
            //                 <div class="line_item__text">
            //                   <div>{(line_item?.price?.product as Product)?.name}</div>
            //                   <div>
            //                     <sc-format-number type="unit" value={(line_item?.price?.product as Product)?.weight} unit={(line_item?.price?.product as Product)?.weight_unit} />
            //                   </div>
            //                 </div>
            //               </div>
            //             </div>
            //             <span slot="price"> {sprintf(__('Qty: %d', 'surecart'), quantity || 0)}</span>
            //           </sc-line-item>
            //         );
            //       })}
            //     </div>
            //   </div>
            // </sc-card>
          ))}
        </sc-dashboard-module>
      </sc-spacing>
    );
  }
}

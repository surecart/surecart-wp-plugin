/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import {
    ScCard, 
    ScDashboardModule, 
    ScStackedList, 
    ScStackedListRow,
    ScIcon,
    ScButton,
    ScFormatDate,
    ScCcLogo,
    ScFormatNumber,
    ScSkeleton,
    ScDivider,
    ScEmpty,
    ScTag,
    ScOrderStatusBadge,
} from '@surecart/components-react';

export default () => {
    const [orders, setOrders] = useState(0);

    useEffect( () => {
        getOrderList();
    } );

    async function getOrderList () {
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/orders/`, {
              expand: ['line_items', 'charge'],
              status: ['paid'],
            }),
            parse: false,
        });
        const ordersList = await ( response.json() );
        console.log( ordersList );
        setOrders( ordersList );
    }

    function renderEmpty() {
        return (
          <div>
            <ScDivider style={{ '--spacing': '0' }}></ScDivider>
            <slot name="empty">
              <ScEmpty icon="shopping-bag">{__("You don't have any orders.", 'surecart')}</ScEmpty>
            </slot>
          </div>
        );
    }

    function renderLoading() {
        return (
            <ScCard>
                <ScStackedList>
                {[...Array(5)].map(() => (
                    <ScSkeleton style={{ 'margin': '0 2%', width: '16%', display: 'inline-block' }}></ScSkeleton>
                ))}
                </ScStackedList>
            </ScCard>
        );
    }

    function renderStatusBadge(order) {
        const { status, charge } = order;
        if (charge && typeof charge === 'object') {
          if (charge?.fully_refunded) {
            return <ScTag type="danger">{__('Refunded', 'surecart')}</ScTag>;
          }
          if (charge?.refunded_amount) {
            return <ScTag type="info">{__('Partially Refunded', 'surecart')}</ScTag>;
          }
        }
    
        return <ScOrderStatusBadge status={status}></ScOrderStatusBadge>;
    }

    function renderList() {
        if ( orders === 0) {
            return renderLoading();
        }

        if ( orders?.length === 0) {
            return renderEmpty();
        }

        return orders.map(order => {
          const { email, name, created_at, url } = order;
          return (
            <ScStackedListRow style={{ '--columns': '5' }}>
              <div>
                <ScFormatDate 
                    date={created_at}
                    month="short"
                    day="numeric"
                    year="numeric"
                    type="timestamp" 
                />
                <br/>
                <ScFormatDate 
                    date={created_at}
                    hour="numeric"						
                    minute="numeric"										
                    type="timestamp"
                />
              </div>
              <div>
                {name}
                <br/>
                {email}
              </div>
              <div>{renderStatusBadge(order)}</div>
              <div>
                <ScCcLogo style={{fontSize: "32px", lineHeight: "1"}} brand={order?.payment_intent?.payment_method?.card?.brand} />
              </div>
              <div>
                <ScFormatNumber type="currency" currency={order?.currency} value={order?.amount_due} />
              </div>
            </ScStackedListRow>
          );
        });
    }

    function renderContent() {
        return (
            <ScCard noPadding>
                <ScStackedList>
                    {renderList()}
                </ScStackedList>
            </ScCard>
        );
    }

    return (
        <ScDashboardModule
            css={css`
                width: 67%;
                @media screen and (max-width: 782px) {
                    width: 100%;
                }
            `}
        >
            <span slot="heading">Recent Orders</span>
            <ScButton slot="end" type="link" href={'admin.php?page=sc-orders'}>
                {__('View All', 'surecart')}
                <ScIcon  slot="suffix" name="chevron-right" />
            </ScButton>

            {renderContent()}
        </ScDashboardModule>
    );
};

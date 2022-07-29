/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { sprintf, __ } from '@wordpress/i18n';
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import {
    ScCard, 
    ScDashboardModule,
    ScSkeleton,
    ScDivider,
    ScEmpty,
} from '@surecart/components-react';

export default (props) => {
    const {startDate, endDate, reportBy}  = props;
    const [ordersStates, setOrdersStates] = useState(0);
    const [lastPeriodDate, setLastPeriodDate] = '2022-07-15';
    const [lastPeriodOrder, setlastPeriodOrder] = useState(0);
    const [series, setSeries] = useState([
        {
            name: 'Demo',
            data: [99, 770, 408, 51, 52, 109, 300]
        },
    ]);

    const chart = {
        options: {
            chart: {
                height: 350,
                width: '100%',
                type: 'area',
                events: {
                    mounted: (chart) => {
                      chart.windowResizeHandler();
                    }
                }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              type: 'datetime',
              categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
            colors: ["#08BA4F"],
            tooltip: {
              x: {
                format: 'dd/MM/yy HH:mm'
              },
            },
            fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.9,
                  stops: [0, 90, 100],
                },
            },
        },
    };

    useEffect( () => {
        getOrderStates();
        getLastOrderStates();
    }, [startDate, reportBy] );

    const getOrderStates = async () => {
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: new Date(startDate).toISOString().slice(0, 10),
                end_at: new Date(endDate).toISOString().slice(0, 10),
                interval: reportBy,
            }),
            parse: false,
        });
        const ordersStates = await ( response.json() );
        setOrdersStates( ordersStates );
    }

    const getLastOrderStates = async () => {
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: lastPeriodDate,
                end_at: new Date(startDate).toISOString().slice(0, 10),
                interval: reportBy,
            }),
            parse: false,
        });
        const lastOrdersStates = await ( response.json() );

        if ( lastOrdersStates?.data?.length !== 0 ) {
            setlastPeriodOrder( lastOrdersStates?.data[0].amount );
        }   
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
            <ScCard css={css`
                height: 360px;
            `}
            >
                {[...Array(3)].map(() => (
                    <ScSkeleton style={{ 'margin': '50px 2% 0px 2%', 'padding-bottom': '43px', width: '96%', display: 'inline-block' }}></ScSkeleton>
                ))}
            </ScCard>
        );
    }
    
    function orderChart() {
        if ( ordersStates === 0 ) {
            return renderLoading();
        }
    
        if ( ordersStates?.data?.length === 0 ) {
            return renderEmpty();
        }

        return (
            <ScCard>   
                <div className="sc-overview-card__title">
                    ${ordersStates.data[0].amount} <span style={{'color':'#64748B', 'font-size': '14px'}}>{sprintf(__("vs $%s last period - %s", "surecart"), lastPeriodOrder, reportBy)}</span>
                </div>
                <div id="chart">
                    <Chart options={chart.options} series={series} type="area" height={280} />
                </div>
            </ScCard>
        );
    }

    return (
        <ScDashboardModule    
            css={css`
                width: 33%;

                .sc-overview-card__title {
                    font-size: 16px;
                }
                @media screen and (max-width: 782px) {
                    width: 100%;
                }
            `}
        >
            <span slot="heading">{__('Revnue', 'surecart')}</span>
            {orderChart()}
        </ScDashboardModule>
    );
};
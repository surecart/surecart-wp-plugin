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
    const {ordersStates, currentTotalOrder, lastTotalOrder, dateRangs, getDataArray} = props;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [currentOrders, setCurrentOrders] = useState(0);
    const [lastOrders, setLastOrders] = useState(0);
    const [series, setSeries] = useState([
        {
            name: __( 'Value', 'surecart' ),
            data: []
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
            yaxis: {
                labels: {
                    formatter: function (value) {
                      return value;
                    }
                }
            },
            xaxis: {
              type: 'date',
              categories: dateRangs,
              labels: {
                formatter: function (value) {
                    let dateObj = new Date(value);
                    return dateObj.getDate() + ' ' + months[dateObj.getMonth()];
                }
              },
              tickAmount: 7,
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
        setSeries([
            {
              name: __( 'Value', 'surecart' ),
              data: getDataArray,
            },
        ]);

        if ( ordersStates.length !== 0 ) {
            setCurrentOrders( currentTotalOrder.count );
        } else {
            setCurrentOrders( 0 );
        }

        if ( lastTotalOrder.length !== 0 ) {
            setLastOrders( lastTotalOrder.count );
        } else {
            setLastOrders( 0 );
        }
    }, [ordersStates, currentTotalOrder, lastTotalOrder] );

    function renderEmpty() {
        return (
            <ScCard css={css`
                .shopping-bag-empty {
                    padding: 100px 0px;
                }
            `}
            >
                <slot name="empty">
                    <ScEmpty className='shopping-bag-empty' icon="bar-chart-2">{__("You don't have any data for report.", 'surecart')}</ScEmpty>
                </slot>
            </ScCard>
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

        return (
            <ScCard>   
                <div className="sc-overview-card__title">
                    {currentOrders} <span style={{'color':'#64748B', 'font-size': '14px'}}>{sprintf(__("vs %s last period", "surecart"), lastOrders)}</span>
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
            <span slot="heading">{__('Orders', 'surecart')}</span>
            {orderChart()}
        </ScDashboardModule>
    );
};
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { sprintf, __ } from '@wordpress/i18n';
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';

import {
    ScCard, 
    ScDashboardModule,
    ScSkeleton,
    ScEmpty,
} from '@surecart/components-react';

export default (props) => {
    const {
        ordersStates,
        currentTotalOrder,
        lastTotalOrder,
        dateRangs,
        getDataArray,
        reportBy,
        errorMsg
    } = props;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [currentRevenue, setCurrentRevenue] = useState(0);
    const [lastRevenue, setLastRevenue] = useState(0);
    const [series, setSeries] = useState([
        {
            name: __( 'Total Revenue', 'surecart' ),
            data: []
        },
    ]);

    const chart = {
        options: {
            chart: {
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
                      return '$'+(value/100);
                    }
                }
            },
            xaxis: {
              type: 'date',
              categories: dateRangs,
              labels: {
                formatter: function (value) {
                    let dateObj = new Date(value);
                    if ( 'month' === reportBy ) {
                        return months[dateObj.getMonth()];
                    } else if ( 'year' === reportBy ) {
                        return dateObj.getFullYear();
                    }
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
              name: __( 'Total Revenue', 'surecart' ),
              data: getDataArray,
            },
        ]);

        if ( currentTotalOrder.length !== 0 ) {
            setCurrentRevenue( currentTotalOrder.revenue );
        } else {
            setCurrentRevenue( 0 );
        }

        if ( lastTotalOrder.length !== 0 ) {
            setLastRevenue( lastTotalOrder.revenue );
        } else {
            setLastRevenue( 0 );
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
                    <ScEmpty className='shopping-bag-empty' icon="bar-chart-2">{errorMsg}</ScEmpty>
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

        if ( ordersStates === 1 ) {
            return renderEmpty();
        }

        return (
            <ScCard>   
                <div className="sc-overview-card__title">
                    ${currentRevenue} <span style={{'color':'#64748B', 'font-size': '14px'}}>{sprintf(__("vs $%s last period", "surecart"), lastRevenue)}</span>
                </div>
                <div id="chart">
                    <Chart options={chart.options} series={series} type="area" height={295} />
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
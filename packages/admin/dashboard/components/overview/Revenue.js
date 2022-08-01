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
    const {ordersStates, lastPeriodOrder, reportBy, dateRangs, getDataArray} = props;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [series, setSeries] = useState([
        {
            name: __( 'Value', 'surecart' ),
            data: []
        },
    ]);

    console.log(getDataArray);

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
                      return '$'+value;
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
              } 
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
        console.log('getDataArray');
        console.log(getDataArray);
        setSeries([
            {
              name: __( 'Value', 'surecart' ),
              data: getDataArray,
            },
        ]);
    }, [getDataArray] );

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
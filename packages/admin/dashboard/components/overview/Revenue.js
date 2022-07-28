/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { sprintf, __ } from '@wordpress/i18n';
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';

import {
    ScCard, 
    ScDashboardModule,
} from '@surecart/components-react';

export default () => {
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
            <span slot="heading">{__('Revenue', 'surecart')}</span>
            <ScCard>   
                <div className="sc-overview-card__title">
                $1,080.12 <span style={{'color':'#64748B', 'font-size': '14px'}}>{sprintf(__("vs $%d last period", "presto-player"), 432)}</span>
                </div>
                <div id="chart">
                    <Chart options={chart.options} series={series} type="area" height={280} />
                </div>
            </ScCard>
            
        </ScDashboardModule>
    );
};
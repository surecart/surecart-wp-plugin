/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Chart from "react-apexcharts";
import { useEffect, useState } from 'react';

import {
    ScCard, 
    ScDashboardModule,
} from '@surecart/components-react';


export default () => {
    const [series, setSeries] = useState([
        {
            name: 'series1',
            data: [31, 40, 408, 51, 52, 109, 300]
        },
    ]);

    const chart = {
        options: {
            chart: {
              height: 350,
              type: 'area',
              width: 516,
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
        },
    };

    return (
        <ScDashboardModule    
            css={css`
                width: 33%;

                @media screen and (max-width: 782px) {
                    width: 100%;
                }
            `}
        >
            <span slot="heading">{__('Orders', 'surecart')}</span>
            <ScCard
                css={css`
                    overflow: hidden;
                    width: 516px;
                `}
            >   
                <div id="chart">
                    <Chart options={chart.options} series={series} type="area" height={280} />
                </div>
            </ScCard>
        </ScDashboardModule>
    );
};
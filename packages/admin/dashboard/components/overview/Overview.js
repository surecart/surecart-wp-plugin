/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';

import Revenue from './Revenue';
import Orders from './Orders';
import AverageOrderValue from './AverageOrderValue';
import DatePicker from "../../DatePicker";
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import {
    ScDropdown, 
    ScButton, 
    ScMenu, 
    ScMenuItem,
    ScDivider,
    ScFlex,
} from '@surecart/components-react';

export default () => {
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = useState(new Date());
    const [reportBy, setReportBy] = useState('day');
    const [ordersStates, setOrdersStates] = useState(0);
    const [reportDataArray, setReportDataArray] = useState(0);
    const [lastPeriodDate, setLastPeriodDate] = '2022-07-15';
    const [lastPeriodOrder, setlastPeriodOrder] = useState(0);

    const reportOrderByList = {
        day: __('Daily', 'surecart'),
        week: __('Weekly', 'surecart'),
        month: __('Monthly', 'surecart'),
        year: __('Yearly', 'surecart'),
    }

    useEffect( () => {
        getOrderStates();
        //getLastOrderStates();
    }, [startDate, reportBy] );

    const getOrderStates = async () => {
        setOrdersStates(0);
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: new Date(startDate).toISOString().slice(0, 10),
                end_at: new Date(endDate).toISOString().slice(0, 10),
                interval: reportBy,
            }),
            parse: false,
        });
        const ordersStates = await ( response.json() );
        console.log('ordersStates:');
        console.log(ordersStates);
        setOrdersStates( ordersStates );
        setReportDataArray( getDataArray(ordersStates, startDate, endDate) );
    }

    const getLastOrderStates = async () => {
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: '2022-07-15',
                end_at: new Date(startDate).toISOString().slice(0, 10),
                interval: reportBy,
            }),
            parse: false,
        });
        const lastOrdersStates = await ( response.json() );

        if ( lastOrdersStates?.data?.length !== 0 ) {
            setlastPeriodOrder( lastOrdersStates?.data[0].count );
        }   
    }

    function getDatesArray (startDate, endDate) {
        let s = new Date(startDate);
        let e = new Date(endDate);
        let a = [];
        while(s <= e) {
            let dateObj = new Date(s);
            a.push(dateObj);
            s = new Date(s.setDate(
                s.getDate() + 1
            ))
        }
        return a;  
    }

    function getDataArray (ordersStates, startDate, endDate, types) {
        if ( ordersStates === 0 ) {
            return;
        }

        if ( ordersStates?.data?.length === 0 ) {
            return;
        }

        let ordersStatesApiData = [];
        let reportObj = {};
        ordersStates.data.map( ordersstates => {
            let dateObj   = new Date(ordersstates.interval_at * 1000);
            let rangeDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
            reportObj[rangeDate] = ordersstates;
            ordersStatesApiData.push( reportObj );
        });

        let getDatesRangs = getDatesArray(startDate, endDate);

        return getDatesRangs.map(function(getDatesRang){
            let dateObj   = new Date(getDatesRang);
            let rangeDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
            if ( ordersStatesApiData[0][rangeDate] ) {
                if ( types === 'orders' ) {
                    return ordersStatesApiData[0][rangeDate].count;
                } else if ( types === 'revenue' ) {
                    return ordersStatesApiData[0][rangeDate].amount;
                } else if ( types === 'average' ) {
                    return ordersStatesApiData[0][rangeDate].average_amount;
                }
            } else {
                return 0;
            }
        });
    }

    return (
        <Fragment>
            <Fragment>
                <h3
                    css={css`
                        font-weight: 600;
                        font-size: 28px;
                        line-height: 28px;
                        margin-top: 0px;
                        color: #334155;
                    `}
                >
                    { __( 'Overview', 'surecart' ) }
                </h3>
                <ScFlex>
                    <div>
                        <DatePicker
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />
                    </div>
                    <div>
                        <ScDropdown placement="bottom-end">
                            <ScButton type="text" slot="trigger" caret>
                                {reportOrderByList[reportBy]}
                            </ScButton>
                            <ScMenu>					    
                                <ScMenuItem onClick={() => setReportBy('day')}>{__('Daily', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => setReportBy('week')}>{__('Weekly', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => setReportBy('month')}>{__('Monthly', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => setReportBy('year')}>{__('Yearly', 'surecart')}</ScMenuItem>
                            </ScMenu>
                        </ScDropdown>
                    </div>
                </ScFlex>
                <ScDivider style={{"--spacing": "0.5em"}} />
            </Fragment>

            <ScFlex style={{ '--sc-flex-column-gap': '2em' }}>
                <Revenue ordersStates={ordersStates} lastPeriodOrder={lastPeriodOrder} reportBy={reportBy} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'revenue')} />
                <Orders ordersStates={ordersStates} lastPeriodOrder={lastPeriodOrder} reportBy={reportBy} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'orders')} />
                <AverageOrderValue ordersStates={ordersStates} lastPeriodOrder={lastPeriodOrder} reportBy={reportBy} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'average')} />
            </ScFlex>
        </Fragment>
    );
};

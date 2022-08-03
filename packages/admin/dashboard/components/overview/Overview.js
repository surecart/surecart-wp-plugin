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
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = useState(new Date());
    const [reportBy, setReportBy] = useState('day');
    const [ordersStates, setOrdersStates] = useState(0);
    const [currentTotalOrder, setCurrentTotalOrder] = useState(0);
    const [lastTotalOrder, setLastTotalOrder] = useState(0);

    const reportOrderByList = {
        day: __('Daily', 'surecart'),
        week: __('Weekly', 'surecart'),
        month: __('Monthly', 'surecart'),
        year: __('Yearly', 'surecart'),
    }

    const defaultTotalOrders = {
        count: 0,
        revenue: 0,
        average: 0,
        currency: '',
    }

    useEffect( () => {
        getOrderStates();
        getLastOrderStates();
    }, [endDate, reportBy] );

    const getOrderStates = async () => {
        let startDateObj = new Date(startDate);
        let endDateObj = new Date(endDate);
        setOrdersStates(0);
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: startDateObj.getFullYear() + '-' + (startDateObj.getMonth() + 1) + '-' + startDateObj.getDate(),
                end_at: endDateObj.getFullYear() + '-' + (endDateObj.getMonth() + 1) + '-' + (endDateObj.getDate() + 1 ),
                interval: reportBy,
            }),
            parse: false,
        });
        const ordersStates = await ( response.json() );
        setOrdersStates( ordersStates );
        setCurrentTotalOrder( getTotalOrdersData(ordersStates) );
    }

    const getLastOrderStates = async () => {
        let startDateObj = new Date(startDate);
        let lastStartDateObj = new Date(startDate);
        let endDateObj = new Date(endDate);
        let diffDays = ( endDateObj.getTime() - startDateObj.getTime() ) / (1000 * 3600 * 24) + 1;
        lastStartDateObj.setDate( startDateObj.getDate() - diffDays );
        const response = await apiFetch({
            path: addQueryArgs(`surecart/v1/stats/orders/`, {
                start_at: lastStartDateObj.getFullYear() + '-' + (lastStartDateObj.getMonth() + 1) + '-' + lastStartDateObj.getDate(),
                end_at: startDateObj.getFullYear() + '-' + (startDateObj.getMonth() + 1) + '-' + ( startDateObj.getDate() + 1 ),
                interval: reportBy,
            }),
            parse: false,
        });
        const lastOrdersStates = await ( response.json() );
        setLastTotalOrder( getTotalOrdersData(lastOrdersStates) );   
    }

    function getTotalOrdersData (ordersStates) {
        if ( ordersStates === 0 ) {
            return defaultTotalOrders;
        }

        if ( ordersStates?.data?.length === 0 ) {
            return defaultTotalOrders;
        }

        let reportCount = 0;
        let reportRevenue = 0;
        let reportAverage = 0;
        let reportCurrency = '';
        ordersStates.data.map( states => {
            reportCount = reportCount + parseInt( states.count );
            reportRevenue = reportRevenue + parseInt( states.amount / 100 );
            reportAverage = reportAverage + parseInt( states.average_amount / 100 );
            reportCurrency = states.currency;
        });            

        return {
            count: reportCount,
            revenue: reportRevenue,
            average: reportAverage,
            currency: reportCurrency,
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
                <Revenue ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'revenue')} />
                <Orders ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'orders')} />
                <AverageOrderValue ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={getDatesArray(startDate, endDate)} getDataArray={getDataArray(ordersStates, startDate, endDate,'average')} />
            </ScFlex>
        </Fragment>
    );
};

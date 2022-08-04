/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { dateI18n, date } from '@wordpress/date';
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
    const [loading, setLoading] = useState(false);
    const [dateRangs, setDateRangs] = useState(null);
    const [dataArrayAvenue, setDataArrayAvenue] = useState(null);
    const [dataArrayOrders, setDataArrayOrders] = useState(null);
    const [dataArrayAverage, setDataArrayAverage] = useState(null);
    const [error, setError] = useState( __('You don\'t have any data for report.', 'surecart') );

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

    const defaultOrderBy = {
        day: 1,
        week: 7,
        month: 31,
        year: 365,
    }

    useEffect( () => {
        getOrderStates();
        getLastOrderStates();
        setDateRangs( getDatesArray(startDate, endDate, reportBy) );
    }, [endDate, reportBy] );

    useEffect( () => {
        setDataArrayAvenue( getDataArray(ordersStates,'revenue') );
        setDataArrayOrders( getDataArray(ordersStates, 'orders') );
        setDataArrayAverage( getDataArray(ordersStates, 'average') );
    }, [ordersStates] );

    const getOrderStates = async () => {
        let startDateObj = new Date(startDate);
        let endDateObj = new Date(endDate);
        setOrdersStates(0);

        setError(false);
		setLoading(true);
		try {
			const response = await apiFetch({
                path: addQueryArgs(`surecart/v1/stats/orders/`, {
                    start_at: dateI18n('Y-m-d H:i:s a', startDateObj.getTime(), true),
                    end_at: dateI18n('Y-m-d H:i:s a', endDateObj.getTime(), true),
                    interval: reportBy,
                }),
                parse: false,
            });
            const ordersStates = await ( response.json() );
            setOrdersStates( ordersStates );
            setCurrentTotalOrder( getTotalOrdersData(ordersStates) );
		} catch (e) {
            const errorObj = await ( e.json() );
            setOrdersStates(1);
            setError(
                errorObj?.message ||
                    __('You don\'t have any data for report.', 'surecart')
            );
		} finally {
			setLoading(false);
		}
    }

    const getLastOrderStates = async () => {
        let startDateObj = new Date(startDate);
        let lastStartDateObj = new Date(startDate);
        let endDateObj = new Date(endDate);
        let diffDays = ( endDateObj.getTime() - startDateObj.getTime() ) / (1000 * 3600 * 24) + 1;
        lastStartDateObj.setDate( startDateObj.getDate() - diffDays );

        setError(false);
		setLoading(true);
		try {
			const response = await apiFetch({
                path: addQueryArgs(`surecart/v1/stats/orders/`, {
                    start_at: dateI18n('Y-m-d H:i:s a', lastStartDateObj, true),
                    end_at: dateI18n('Y-m-d H:i:s a', startDateObj, true),
                    interval: reportBy,
                }),
                parse: false,
            });
            if (response) {
                const lastOrdersStates = await ( response.json() );
                setLastTotalOrder( getTotalOrdersData(lastOrdersStates) );
			} else {
				setLastTotalOrder(0);
			}
		} catch (e) {
            const errorObj = await ( e.json() );
            setError(
                errorObj?.message ||
                    __('You don\'t have any data for report.', 'surecart')
            );
			setLastTotalOrder(0);
		} finally {
			setLoading(false);
		} 
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

    function getDatesArray (startDate, endDate, reportBy) {
        let s = new Date(startDate);
        let e = new Date(endDate);
        let a = [];
        while(s <= e) {
            let dateObj = new Date(s);
            a.push(dateObj);
            s = new Date(s.setDate(
                s.getDate() + defaultOrderBy[reportBy]
            ))
        }
        return a;
    }

    function getDataArray (ordersStates, types) {
        if ( ordersStates === 0 || ordersStates === 1 ) {
            return;
        }

        if ( ordersStates?.data?.length === 0 ) {
            return;
        }

        console.log('ordersStatesApiData:');
        console.log(ordersStates);
        let ordersStatesApiData = [];
        let reportObj = {};
        ordersStates.data.map( ordersstates => {
            let dateObj   = new Date(ordersstates.interval_at * 1000);
            let rangeDate = date('Y-m-d', dateObj);

            if ( 'week' === reportBy ) {
                rangeDate = date('Y-m-d', dateObj);
            } else if ( 'month' === reportBy ) {
                rangeDate = date('Y-m', dateObj);
            } else if ( 'year' === reportBy ) {
                rangeDate = dateObj.getFullYear();
            }

            reportObj[rangeDate] = ordersstates;
            ordersStatesApiData.push( reportObj );
        });

        //console.log('getDatesRangs:');
        //console.log(dateRangs);

        return dateRangs.map(function(getDatesRang){
            let dateObj   = new Date(getDatesRang);
            let rangeDate = date('Y-m-d', dateObj);
            let isCorrectRange = 0;
            let rangeDateEnd = '';

            if ( 'week' === reportBy ) {
                rangeDate    = date('Y-m-d', dateObj);
                rangeDateEnd = new Date(getDatesRang).getDate() + 7;
                rangeDateEnd = date('Y-m-d', rangeDateEnd);
            } else if ( 'month' === reportBy ) {
                dateObj   = new Date(getDatesRang);
                rangeDate = date('Y-m', dateObj);
            } else if ( 'year' === reportBy ) {
                rangeDate = dateObj.getFullYear();
            }

            if ( 'day' === reportBy && ordersStatesApiData[0][rangeDate] ) {
                isCorrectRange = 1;
            } else if ( 'week' === reportBy && ordersStatesApiData[0][rangeDate] ) {
                isCorrectRange = 1;
            } else if ( ordersStatesApiData[0][rangeDate] ) {
                isCorrectRange = 1;
            }

            if ( 1 === isCorrectRange ) {
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
                <Revenue ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={dateRangs} getDataArray={dataArrayAvenue} reportBy={reportBy} errorMsg={error} />
                <Orders ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={dateRangs} getDataArray={dataArrayOrders} reportBy={reportBy} errorMsg={error} />
                <AverageOrderValue ordersStates={ordersStates} currentTotalOrder={currentTotalOrder} lastTotalOrder={lastTotalOrder} dateRangs={dateRangs} getDataArray={dataArrayAverage} reportBy={reportBy} errorMsg={error} />
            </ScFlex>
        </Fragment>
    );
};

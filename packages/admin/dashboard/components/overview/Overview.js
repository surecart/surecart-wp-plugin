/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

import Revenue from './Revenue';
import Orders from './Orders';
import AverageOrderValue from './AverageOrderValue';
import DatePicker from "../../DatePicker";

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
    const reportOrderByList = {
        day: __('Daily', 'surecart'),
        week: __('Weekly', 'surecart'),
        month: __('Monthly', 'surecart'),
        year: __('Yearly', 'surecart'),
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

            <ScFlex columnGap="2em">
                <Revenue startDate={startDate} endDate={endDate} reportBy={reportBy} />
                <Orders startDate={startDate} endDate={endDate} reportBy={reportBy} />
                <AverageOrderValue startDate={startDate} endDate={endDate} reportBy={reportBy} />
            </ScFlex>
        </Fragment>
    );
};

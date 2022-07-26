/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

import Revenue from './Revenue';
import Orders from './Orders';
import AverageOrderValue from './AverageOrderValue';

import {
    ScDropdown, 
    ScButton, 
    ScMenu, 
    ScMenuItem,
    ScDivider,
    ScFlex,
} from '@surecart/components-react';

export default () => {
    return (
        <Fragment>
            <Fragment>
                <h3
                    css={css`
                        font-weight: 600;
                        font-size: 28px;
                        line-height: 28px;
                        margin-top: 50px;
                        color: #334155;               
                    `}
                >
                    { __( 'Overview', 'surecart' ) }
                </h3>
                <ScFlex>
                    <div>
                        {__('Select Date', 'surecart')}
                    </div>
                    <div>
                        <ScDropdown placement="bottom-end">
                            <ScButton type="text" slot="trigger" caret>
                                {__('Daily', 'surecart')}
                            </ScButton>
                            <ScMenu>					    
                                <ScMenuItem onClick={() => {}}>{__('Daily', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => {}}>{__('Weekly', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => {}}>{__('Monthly', 'surecart')}</ScMenuItem>
                                <ScMenuItem onClick={() => {}}>{__('Yearly', 'surecart')}</ScMenuItem>
                            </ScMenu>
                        </ScDropdown>
                    </div>
                </ScFlex>
                <ScDivider style={{"--spacing": "0.5em"}} />
            </Fragment>

            <ScFlex columnGap="xx-large">
                <Revenue />
                <Orders />
                <AverageOrderValue />
            </ScFlex>
        </Fragment>
    );
};

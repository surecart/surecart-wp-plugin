/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

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
            <div>
                <h3
                    css={css`
                        font-weight: 600;
                        font-size: 28px;
                        line-height: 28px;
                        color: #334155;               
                    `}
                >
                    { __( 'Overview', 'surecart' ) }
                </h3>
                <ScFlex>
                    <ScDropdown placement="bottom-end">
                        <ScButton type="text" slot="trigger" caret>
                            {__('Select Date', 'surecart')}
                        </ScButton>
                        <ScMenu>					    
                            <ScMenuItem onClick={() => {}}>{__('Daily', 'surecart')}</ScMenuItem>
                        </ScMenu>
                    </ScDropdown>
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
                </ScFlex>
                <ScDivider style={{"--spacing": "1em"}} />
            </div>

            <ScFlex>
                <Revenue />
                <Orders />
                <AverageOrderValue />
            </ScFlex>
        </Fragment>
    );
};

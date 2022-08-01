/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScCard, ScIcon, ScFlex } from '@surecart/components-react';
import GetStartedBox from '../GetStartedBox';
import { useEffect, useState } from 'react';
import { dispatch } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

export default () => {
    const [showGetStarted, setShowGetStarted] = useState(1);

    const removeGetStarted = () => {
        wp.data
        .dispatch( 'core/preferences' )
        .set( 'surecart/dashboard-get-started', 'ScShowGetStartedStatus7', 0 );
        setShowGetStarted(0);
    }

    useEffect(() => {
        setShowGetStarted( wp.data
        .select( 'core/preferences' )
        .get( 'surecart/dashboard-get-started', 'ScShowGetStartedStatus7' ) );
    });

    if ( 0 === showGetStarted ) {
        return '';
    }

    return (
        <ScCard
            css={css`
                position: relative;
                margin-bottom: 50px;
                .sc-getstarted-inner-wrap{
                    padding: 20px;
                }
                .sc-get-started-main-title{
                    font-size: 28px;
                    font-weight: 600;
                    line-height: 28px;
                    text-align: left;
                    margin: 0px 0px 1.2em 0px; 
                }
                .sc-getstarted-close-icon {
                    position: absolute;
                    right: 30px;
                    top: 30px;
                    cursor: pointer;
                }
            `}
        >
            <div className='sc-getstarted-inner-wrap'>
                <ScIcon className='sc-getstarted-close-icon' onClick={removeGetStarted} name="x" />
                <h3 className='sc-get-started-main-title'>
                    { __( 'Get started with SureCart', 'surecart' ) }
                </h3>
                <ScFlex>
                    <GetStartedBox
                        infoType = 'info'
                        infoText = { __( 'Setup', 'surecart' ) }
                        title = { __( 'Create products', 'surecart' ) }
                        description = { __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }
                        buttonLabel = { __( 'Create A Product', 'surecart' ) }
                        buttonUrl = {'admin.php?page=sc-products&action=edit'}
                    />
                    <GetStartedBox
                        infoType = 'success'
                        infoText = { __( 'Tutorial', 'surecart' ) }
                        title = { __( 'Add buy and cart buttons', 'surecart' ) }
                        description = { __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }
                        buttonLabel = { __( 'How To Add Buttons', 'surecart' ) }
                        buttonUrl = {'admin.php?page=sc-products'}
                    />
                    <GetStartedBox
                        infoType = 'primary'
                        infoText = { __( 'Customize', 'surecart' ) }
                        title = { __( 'Customize forms', 'surecart' ) }
                        description = { __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }
                        buttonLabel = { __( 'Customize', 'surecart' ) }
                        buttonUrl = {'edit.php?post_type=sc_form'}
                    />
                </ScFlex>
            </div>
        </ScCard>
    );
};

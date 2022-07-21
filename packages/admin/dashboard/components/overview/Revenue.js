/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

export default () => {
    return (
        <Fragment>
            <div
                css={css`
                    width: 33%;

                    @media screen and (max-width: 782px) {
                        width: 100%;
                    }
                `}
            >
                <h3
                    css={css`
                        font-weight: 600;
                        font-size: 20px;
                        line-height: 28px;
                        color: #334155;               
                    `}
                >
                    { __( 'Avenue', 'surecart' ) }
                </h3>
                <div 
                    css={css`
                        border-radius: 8px; 
                        padding: 40px;
                        background-color: #fff;
                        border: 1px solid #D3E7EC;
                        box-shadow: 0px 1px 2px 0px #0000000F;
                    `}
                >
                    { __( 'Coming soon.....', 'surecart' ) }
                </div>
            </div>
        </Fragment>
    );
};

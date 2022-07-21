/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

export default () => {
    return (
        <Fragment>
            <div 
                css={css`
                    border-radius: 8px; 
                    padding: 40px;
                    background-color: #fff;
                    border: 1px solid #D3E7EC;
                    box-shadow: 0px 1px 2px 0px #0000000F;
                `}
            >
                <h3
                    css={css`
                        font-size: 28px;
                        font-weight: 600;
                        line-height: 28px;
                        text-align: left;
                        margin: 0px 0px 1.2em 0px;                   
                    `}
                >
                    { __( 'Get started with SureCart', 'surecart' ) }
                </h3>
                <div
                    css={css`
                        display: flex;
                        column-gap: 2em;
                        
                        @media screen and (max-width: 782px) {
                            display: inherit;
                        }
                    `}
                >
                    <div
                        css={css`
                            width: 33%;

                            @media screen and (max-width: 782px) {
                                width: 100%;
                            }
                        `}
                    >
                        <p
                            css={css`
                                font-size: 13px;
                                font-weight: 500;
                                line-height: 28px;
                                text-align: center;   
                                color: #1E3A8A;
                                background-color: #EFF6FF;
                                border-radius: 3.5px;
                                width: 47px;
                                height: 27px; 
                                margin: 0.4em 0;                                 
                            `}
                        >
                            { __( 'Setup', 'surecart' ) }
                        </p>
                        <p
                            css={css`
                                font-weight: 600;
                                font-size: 20px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0;                 
                            `}
                        >{ __( 'Create products', 'surecart' ) }</p>
                        <p
                            css={css`
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0 1em 0;                 
                            `}
                        >{ __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }</p>
                        <a
                            css={css`
                                justify-content: center;
                                align-items: center;
                                padding: 10px 42px;
                                width: 164px;
                                background-color: #002529;
                                border-radius: 3.5px;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 28px;
                                color: #fff;
                                text-decoration: none;
                            `}
                        href='#'>{ __( 'Create A Product', 'surecart' ) } &#8594;</a>
                    </div>

                    <div
                        css={css`
                            width: 33%;

                            @media screen and (max-width: 782px) {
                                width: 100%;
                            }
                        `}
                    >
                        <p
                            css={css`
                                font-size: 13px;
                                font-weight: 500;
                                line-height: 28px;
                                text-align: center;   
                                color: #1E3A8A;
                                background-color: #DCFCE7;
                                border-radius: 3.5px;
                                width: 63px;
                                height: 27px; 
                                margin: 0.4em 0;
                                
                                @media screen and (max-width: 782px) {
                                    margin: 2.5em 0 0 0;
                                }
                            `}
                        >
                            { __( 'Tutorial', 'surecart' ) }
                        </p>
                        <p
                            css={css`
                                font-weight: 600;
                                font-size: 20px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0;                 
                            `}
                        >{ __( 'Add buy and cart buttons', 'surecart' ) }</p>
                        <p
                            css={css`
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0 1em 0;                 
                            `}
                        >{ __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }</p>
                        <a
                            css={css`
                                justify-content: center;
                                align-items: center;
                                padding: 10px 42px;
                                width: 164px;
                                background-color: #002529;
                                border-radius: 3.5px;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 28px;
                                color: #fff;
                                text-decoration: none;
                            `}
                        href='#'>{ __( 'How To Add Buttons', 'surecart' ) } &#8594;</a>
                    </div>

                    <div
                        css={css`
                            width: 33%;

                            @media screen and (max-width: 782px) {
                                width: 100%;
                            }
                        `}
                    >
                        <p
                            css={css`
                                font-size: 13px;
                                font-weight: 500;
                                line-height: 28px;
                                text-align: center;   
                                color: #1E3A8A;
                                background-color: #F3E8FF;
                                border-radius: 3.5px;
                                width: 86px;
                                height: 27px; 
                                margin: 0.4em 0;
                                
                                @media screen and (max-width: 782px) {
                                    margin: 2.5em 0 0 0;
                                }
                            `}
                        >
                            { __( 'Customize', 'surecart' ) }
                        </p>
                        <p
                            css={css`
                                font-weight: 600;
                                font-size: 20px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0;                 
                            `}
                        >{ __( 'Customize forms', 'surecart' ) }</p>
                        <p
                            css={css`
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 28px;
                                color: #334155;
                                margin: 0.4em 0 1em 0;                 
                            `}
                        >{ __( 'Customize your checkout forms with a no-code experience.', 'surecart' ) }</p>
                        <a
                            css={css`
                                justify-content: center;
                                align-items: center;
                                padding: 10px 42px;
                                width: 164px;
                                background-color: #002529;
                                border-radius: 3.5px;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 28px;
                                color: #fff;
                                text-decoration: none;
                            `}
                        href='#'>{ __( 'Customize', 'surecart' ) } &#8594;</a>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

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
                    { __( 'Learn More', 'surecart' ) }
                </h3>

                <div 
                    css={css`
                        border-radius: 8px;
                        background-color: #fff;
                        border: 1px solid #D3E7EC;
                        box-shadow: 0px 1px 2px 0px #0000000F;
                    `}
                >
                    <ul>
                        <li
                            css={css`
                                border-bottom: 1px solid #D3E7EC;
                                box-shadow: 0px 1px 2px 0px #0000000F;
                                padding: 10px 30px;
                                display: flex;
                                column-gap: 1em;
                                align-items: center;
                                justify-content: center;
                            `}
                        >   
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 13%;                          
                                `}
                            >
                                <svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M33.86 3.917H7.14A3.724 3.724 0 0 0 3.418 7.64v26.718a3.724 3.724 0 0 0 3.724 3.724H33.86a3.724 3.724 0 0 0 3.724-3.724V7.641a3.724 3.724 0 0 0-3.724-3.724Zm-21.902 0v34.166M29.042 3.917v34.166M3.417 21h34.166M3.417 12.458h8.541M3.417 29.542h8.541m17.084 0h8.541m-8.541-17.084h8.541" stroke="#08BA4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </p>
                            <p
                                css={css`
                                    width: 80%;
                                    margin: 0.4em 0;                         
                                `}
                            >
                                <p
                                    css={css`
                                        font-weight: 700;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                       
                                    `}
                                >
                                    { __( 'Tutorial Videos', 'surecart' ) }
                                </p>
                                <p
                                    css={css`
                                        font-weight: 400;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                            
                                    `}
                                >
                                    { __( 'Learn more about SureCart', 'surecart' ) }
                                </p>
                            </p>    
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 2%;
                                    text-align: right;                      
                                `}
                            >
                                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.75 10.5L5.25 6L0.75 1.5" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </p>
                        </li>

                        <li
                            css={css`
                                border-bottom: 1px solid #D3E7EC;
                                box-shadow: 0px 1px 2px 0px #0000000F;
                                padding: 10px 30px;
                                display: flex;
                                column-gap: 1em;
                                align-items: center;
                                justify-content: center;
                            `}
                        >   
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 13%;                          
                                `}
                            >
                                <svg width="45" height="38" viewBox="0 0 45 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.111 36.5v-3.889a7.778 7.778 0 0 0-7.778-7.778H8.778A7.778 7.778 0 0 0 1 32.611V36.5m15.556-19.444a7.778 7.778 0 1 0 0-15.556 7.778 7.778 0 0 0 0 15.556ZM43.778 36.5v-3.889a7.778 7.778 0 0 0-5.834-7.525M30.167 1.753a7.777 7.777 0 0 1 0 15.07" stroke="#08BA4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </p>
                            <p
                                css={css`
                                    width: 80%;
                                    margin: 0.4em 0;                         
                                `}
                            >
                                <p
                                    css={css`
                                        font-weight: 700;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                       
                                    `}
                                >
                                    { __( 'Join Our Community', 'surecart' ) }
                                </p>
                                <p
                                    css={css`
                                        font-weight: 400;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                            
                                    `}
                                >
                                    { __( 'Connect with others in on Facebook', 'surecart' ) }
                                </p>
                            </p>    
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 2%;
                                    text-align: right;                          
                                `}
                            >
                                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.75 10.5L5.25 6L0.75 1.5" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </p>
                        </li>

                        <li
                            css={css`
                                padding: 10px 30px;
                                display: flex;
                                column-gap: 1em;
                                align-items: center;
                                justify-content: center;
                            `}
                        >   
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 13%;                          
                                `}
                            >
                                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 41c11.046 0 20-8.954 20-20S32.046 1 21 1 1 9.954 1 21s8.954 20 20 20Z" stroke="#08BA4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 29a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.86 6.86l8.48 8.48m11.32 11.32 8.48 8.48m-8.48-19.8 8.48-8.48m-8.48 8.48 7.06-7.06M6.86 35.14l8.48-8.48" stroke="#08BA4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </p>
                            <p
                                css={css`
                                    width: 80%;
                                    margin: 0.4em 0;                         
                                `}
                            >
                                <p
                                    css={css`
                                        font-weight: 700;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                       
                                    `}
                                >
                                    { __( 'Get Help', 'surecart' ) }
                                </p>
                                <p
                                    css={css`
                                        font-weight: 400;
                                        font-size: 16px;
                                        line-height: 28px;
                                        color: #334155; 
                                        margin: 0.4em 0;                            
                                    `}
                                >
                                    { __( 'Contact our support for additional help', 'surecart' ) }
                                </p>
                            </p>    
                            <p
                                css={css`
                                    margin: 0.4em 0;
                                    width: 2%;
                                    text-align: right;                          
                                `}
                            >
                                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.75 10.5L5.25 6L0.75 1.5" stroke="#334155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

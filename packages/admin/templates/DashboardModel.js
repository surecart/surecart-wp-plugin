/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import admin from '../styles/admin';

export default ({
	children,
	title,
}) => {

	return (
		<Fragment>
			<Global
				styles={css`
					${admin}
					#wpwrap {
						background-color: #F2FAFC;
					}
					#wpcontent {
						padding: 0;
					}
				`}
			/>
			<>
                <div
                    css={css`
                        position: sticky;
                        background-color: rgba(255, 255, 255, 0.75);
                        backdrop-filter: blur(5px);
                        top: 32px;
                        width: 100%;
                        z-index: 4;
                        margin-bottom: var(
                            --sc-spacing-xx-large
                        ) !important;

                        @media screen and (max-width: 782px) {
                            top: 46px;
                        }
                    `}
                >
                    <div
                        css={css`
                            padding: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        `}
                    >
                        <div
                            css={css`
                                display: flex;
                                align-items: center;
                                column-gap: 1em;
                            `}
                        >
                            <h1
                                css={css`
                                    margin: 0;
                                    font-size: var(--sc-font-size-large);
                                `}
                            >
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>

                <div
                    css={css`
                        padding: 0 20px;
                        display: grid;
                        margin: auto;
                        max-width: 95%;
                    `}
                >
                    <div
                        css={css`
                            margin-bottom: 3em;
                            > * ~ * {
                                margin-top: var(--sc-spacing-xxx-large);
                            }
                        `}
                    >
                        {children}
                    </div>
                    <div>
                        <div
                            css={css`
                                margin-bottom: 3em;
                                > * ~ * {
                                    margin-top: 1em;
                                }
                            `}
                        >
                        </div>
                    </div>
                </div>
            </>
		</Fragment>
	);
};

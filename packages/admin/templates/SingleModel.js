/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { SnackbarList, Tooltip } from '@wordpress/components';
import { PostLockedModal } from '@wordpress/editor';
import StatusBadge from '../components/StatusBadge';
import BrowserUrl from '../components/browser-url';
import UnsavedChangesWarning from '../components/unsaved-changes-warning';
import ErrorBoundary from '../components/error-boundary';
import { CeForm, CeButton } from '@checkout-engine/components-react';
import useSnackbar from '../hooks/useSnackbar';

export default ({
	children,
	pageModelName,
	title,
	button,
	footer,
	noticeUI,
	backUrl,
	backButtonType,
	backText,
	status,
	notices,
	removeNotice,
	onSubmit,
	onInvalid,
	loading,
	sidebar,
	onError,
}) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	return (
		<Fragment>
			<Global
				styles={css`
					:root {
						--ce-color-primary: 200 !important;
						--ce-color-primary-luminance: 36% !important;
						--ce-color-primary-saturation: 100% !important;
					}
				`}
			/>
			<ErrorBoundary onError={onError}>
				<BrowserUrl path={pageModelName} />
				<UnsavedChangesWarning />
				<CeForm
					className="ce-model-form"
					onCeFormSubmit={onSubmit}
					onCeFormInvalid={onInvalid}
					css={css`
						font-size: 14px;
						margin-right: 20px;

						button {
							font-size: 13px;
						}

						--ce-highlight-color: 200 !important;
						--ce-color-luminance: 36% !important;

						/* --ce-color-primary-300: hsl(
							from var( --wp-admin-theme-color ) h s
								calc( l - 5% )
						);
						--ce-color-primary-400: hsl(
							from var( --wp-admin-theme-color ) h s
								calc( l - 5% )
						);
						--ce-color-primary-500: var( --wp-admin-theme-color );
						--ce-color-primary-600: hsl(
							from var( --wp-admin-theme-color ) h s
								calc( l - 5% )
						);
						--ce-color-primary-700: hsl(
							from var( --wp-admin-theme-color ) h s
								calc( l - 5% )
						); */

						// change theme color
						/* --wp-admin-theme-color: var( --ce-color-primary-500 );
						--wp-admin-theme-color-darker-10: var(
							-ce-color-primary-600
						);
						--wp-admin-theme-color-darker-20: var(
							-ce-color-primary-700
						); */

						ce-form-row:not(:last-child) {
							margin-bottom: 20px;
						}

						select {
							max-width: none;
						}

						.components-snackbar.is-snackbar-error {
							background: #cc1818;
						}
						.components-snackbar-list__notice-container {
							float: right;
						}

						.components-text-control__input,
						.components-input-control__container
							.components-input-control__input {
							&[type='text'],
							&[type='tel'],
							&[type='time'],
							&[type='url'],
							&[type='week'],
							&[type='password'],
							&[type='color'],
							&[type='date'],
							&[type='datetime'],
							&[type='datetime-local'],
							&[type='email'],
							&[type='month'],
							&[type='number'] {
								height: 40px;
								border-radius: 4px;
								border: 1px solid #9898a0;
								padding: 10px 12px;
								box-shadow: rgb(0 0 0 / 5%) 0px 1px 2px 0px;
							}
						}

						.is-error {
							.components-text-control__input {
								border-color: #cc1818;
							}
							.components-text-control__input:focus {
								border-color: #cc1818;
								box-shadow: 0 0 0 1px #cc1818;
							}
						}
					`}
				>
					<div
						css={css`
							position: sticky;
							background: #fff;
							margin-left: -20px;
							margin-bottom: 30px;
							top: 32px;
							z-index: 4;

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
								{!!backUrl && (
									<Tooltip
										text={
											backText ||
											__('Go back.', 'checkout_engine')
										}
									>
										{backButtonType === 'icon' ? (
											<a
												href={backUrl}
												css={css`
													color: black;
													display: flex;
													align-items: center;
													cursor: pointer;
													padding: 0.5em 1em;
													border-right: 1px solid
														#dcdcdc;
												`}
											>
												<ce-icon name="x"></ce-icon>
											</a>
										) : (
											<CeButton
												circle
												size="small"
												href={backUrl}
											>
												&larr;
											</CeButton>
										)}
									</Tooltip>
								)}

								<h1
									css={css`
										margin: 0;
										font-size: var(
											--ce-form-section-font-size
										);
										font-weight: var(
											--ce-form-section-font-weight
										);
									`}
								>
									{title}
								</h1>
								{!loading && status && (
									<StatusBadge status={status} />
								)}
							</div>

							{button}
						</div>
						<div
							css={css`
								.components-notice {
									margin: 0;
								}
							`}
						>
							{noticeUI}
						</div>
					</div>

					<div
						css={css`
							padding: 0 5px;
							display: grid;
							margin: auto;
							max-width: 1280px;
							@media screen and (min-width: 960px) {
								grid-template-columns: 1fr 380px;
								grid-gap: 2em;
								grid-template-areas: 'nav    sidebar';
							}
						`}
					>
						<div
							css={css`
								margin-bottom: 3em;
								> * ~ * {
									margin-top: 2em;
								}
							`}
						>
							{children}
							{footer && (
								<div>
									<hr
										css={css`
											margin: 1.5em 0;
										`}
									/>
									{footer}
								</div>
							)}
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
								{sidebar}
							</div>
						</div>
					</div>
					<SnackbarList
						css={css`
							position: fixed !important;
							left: auto !important;
							right: 40px;
							bottom: 40px;
							width: auto !important;

							:first-letter {
								text-transform: uppercase;
							}
						`}
						notices={snackbarNotices}
						onRemove={removeSnackbarNotice}
					/>
				</CeForm>
			</ErrorBoundary>
			<PostLockedModal />
		</Fragment>
	);
};

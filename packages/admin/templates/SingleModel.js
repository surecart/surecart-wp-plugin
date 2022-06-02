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
import { ScForm, ScButton } from '@surecart/components-react';
import useSnackbar from '../hooks/useSnackbar';
import admin from '../styles/admin';

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
					${admin}
					#wpwrap {
						background-color: var(--sc-color-gray-100);
					}
				`}
			/>
			<ErrorBoundary onError={onError}>
				<BrowserUrl path={pageModelName} />
				<UnsavedChangesWarning />
				<ScForm
					className="sc-model-form"
					onScFormSubmit={onSubmit}
					css={css`
						font-size: 14px;
						margin-right: 20px;

						button {
							font-size: 13px;
						}

						--sc-highlight-color: 200 !important;
						--sc-color-luminance: 36% !important;

						sc-form-row:not(:last-child) {
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
								{!!backUrl && (
									<Tooltip
										text={
											backText ||
											__('Go back.', 'surecart')
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
												<sc-icon name="x"></sc-icon>
											</a>
										) : (
											<ScButton
												circle
												size="small"
												href={backUrl}
											>
												<sc-icon name="arrow-left"></sc-icon>
											</ScButton>
										)}
									</Tooltip>
								)}

								<h1
									css={css`
										margin: 0;
										font-size: var(--sc-font-size-large);
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
							max-width: ${sidebar ? '1160px' : '752px'};
							${sidebar &&
							`@media screen and (min-width: 960px) {
								grid-template-columns: 1fr 380px;
								grid-gap: var(--sc-spacing-xxx-large);
								grid-template-areas: 'nav    sidebar';
							}`}
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
				</ScForm>
			</ErrorBoundary>
			<PostLockedModal />
		</Fragment>
	);
};

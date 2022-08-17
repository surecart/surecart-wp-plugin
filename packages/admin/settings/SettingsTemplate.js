/** @jsx jsx */
import useSnackbar from '../hooks/useSnackbar';
import SaveButton from '../templates/SaveButton';
import UnsavedChangesWarning from '../templates/UpdateModel/UnsavedChangesWarning';
import { css, jsx, Global } from '@emotion/core';
import { ScForm } from '@surecart/components-react';
import { SnackbarList } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({
	title,
	onSubmit,
	children,
	icon,
	noButton,
	prefix,
	suffix,
}) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	return (
		<ScForm onScSubmit={onSubmit}>
			<Global
				styles={css`
					:root {
						--wp-admin-theme-color: var(--sc-color-primary-500);
						--wp-admin-theme-color-darker-10: var(
							--sc-color-primary-500
						);
						--wp-admin-theme-color-darker-20: var(
							--sc-color-primary-500
						);
					}
				`}
			/>
			<UnsavedChangesWarning></UnsavedChangesWarning>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid rgba(229, 231, 235, 1);
					padding-bottom: 1rem;
					margin-bottom: 2rem !important;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					{!!prefix && prefix}
					<h3
						css={css`
							margin: 0;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							font-size: 1.1rem;
							line-height: 1.75rem;
							font-weight: 600;
							color: rgba(17, 24, 39, 1);
							display: flex;
							align-items: center;
							gap: 0.5em;
							color: var(--sc-color-gray-900);
						`}
					>
						{icon}
						<span>{title}</span>
					</h3>
				</div>
				{!noButton && <SaveButton>{__('Save', 'surecart')}</SaveButton>}
				{!!suffix && suffix}
			</div>

			<div
				css={css`
					display: grid;
					gap: 3em;
				`}
				style={{ '--sc-form-row-spacing': 'var(--sc-spacing-large)' }}
			>
				{children}
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
	);
};

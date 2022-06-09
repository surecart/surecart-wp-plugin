/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { SnackbarList } from '@wordpress/components';
import { ScForm } from '@surecart/components-react';
import UnsavedChangesWarning from '../templates/UpdateModel/UnsavedChangesWarning';
import SaveButton from '../templates/SaveButton';
import useSnackbar from '../hooks/useSnackbar';

export default ({ title, onSubmit, children, icon }) => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	return (
		<ScForm onScSubmit={onSubmit}>
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
				<SaveButton>{__('Save', 'surecart')}</SaveButton>
			</div>

			<div
				css={css`
					display: grid;
					gap: 3em;
				`}
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

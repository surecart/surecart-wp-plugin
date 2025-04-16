/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import Error from '../Error';

export default ({
	onRequestClose,
	open,
	onConfirm,
	loading,
	error,
	children,
	...props
}) => {
	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={onConfirm}
			onCancel={onRequestClose}
			{...props}
		>
			<Error
				error={error}
				css={css`
					margin-bottom: var(--sc-spacing-small);
				`}
			/>
			{children}
			{!!loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};

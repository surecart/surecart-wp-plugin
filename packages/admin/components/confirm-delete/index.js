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

export default ({ onRequestClose, open, onDelete, deleting, error }) => {
	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={onDelete}
			onCancel={onRequestClose}
		>
			<Error error={error} />
			{__('Are you sure? This cannot be undone.', 'surecart')}
			{!!deleting && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
} from '@surecart/components-react';
import Error from '../Error';

export default function ({
	open,
	onRequestClose,
	onEditAddress,
	error,
	setError,
	busy,
	title,
	description,
}) {
	return (
		<ScDialog
			label={title}
			open={open}
			onScRequestClose={onRequestClose}
			style={{
				'--dialog-body-overflow': 'visible',
			}}
		>
			<ScFlex flexDirection="column" style={{ gap: '1em' }}>
				<Error error={error} setError={setError} />
				{description}
			</ScFlex>
			<ScButton
				type="text"
				onClick={onRequestClose}
				disabled={busy}
				slot="footer"
			>
				{__('Cancel', 'surecart')}
			</ScButton>
			<ScButton
				type="primary"
				disabled={busy}
				onClick={onEditAddress}
				slot="footer"
			>
				{__('Delete', 'surecart')}
			</ScButton>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
}

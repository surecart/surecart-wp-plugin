/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScAddress,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
} from '@surecart/components-react';
import Error from '../Error';

export default function ({
	isEdit,
	open,
	address,
	setAddress,
	error,
	setError,
	onEditAddress,
	onRequestClose,
	busy,
	title,
}) {
	if (!open) return null;

	return (
		<ScDialog
			label={title}
			open={open}
			onScRequestClose={onRequestClose}
			style={{
				'--dialog-body-overflow': 'visible',
			}}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScSubmit={onEditAddress}
				onScFormSubmit={(e) => {
					e.stopImmediatePropagation();
				}}
			>
				<ScAddress
					address={address}
					onScChangeAddress={(e) => setAddress(e.detail)}
					required
				/>
				<ScFlex justifyContent="flex-end">
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={busy}
					>
						{__('Cancel', 'surecart')}
					</ScButton>{' '}
					<ScButton type="primary" disabled={busy} submit>
						{isEdit()
							? __('Update Address', 'surecart')
							: __('Save Address', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>

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

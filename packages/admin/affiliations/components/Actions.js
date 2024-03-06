/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ loading, affiliation, onActivate, onDeactivate }) => {
	if (!affiliation?.id) {
		return '';
	}
	const confirmActivate = () =>
		confirm(__('Are you sure to activate the affiliate user?', 'surecart'));

	const confirmDeactivate = () =>
		confirm(
			__('Are you sure to de-activate the affiliate user?', 'surecart')
		);

	if (affiliation?.active) {
		return (
			<ScButton
				type="danger"
				outline={true}
				loading={loading}
				onClick={() => confirmDeactivate() && onDeactivate()}
			>
				<ScIcon slot="prefix" name="x-circle" />
				{__('De-activate', 'surecart')}
			</ScButton>
		);
	}

	return (
		<ScButton
			type="success"
			outline={true}
			loading={loading}
			onClick={() => confirmActivate() && onActivate()}
		>
			<ScIcon slot="prefix" name="check-circle" />
			{__('Activate', 'surecart')}
		</ScButton>
	);
};

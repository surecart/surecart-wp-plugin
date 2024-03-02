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

	return (
		<>
			{!affiliation?.active && (
				<ScButton
					type="success"
					outline={true}
					loading={loading}
					onClick={() =>
						confirm(
							__(
								'Are you sure to activate the affiliate user?',
								'surecart'
							)
						) && onActivate()
					}
				>
					<ScIcon
						slot="prefix"
						style={{ opacity: 0.5 }}
						name="check-circle"
					/>
					{__('Activate', 'surecart')}
				</ScButton>
			)}

			{affiliation?.active && (
				<ScButton
					type="danger"
					loading={loading}
					outline={true}
					onClick={() =>
						confirm(
							__(
								'Are you sure to de-activate the affiliate user?',
								'surecart'
							)
						) && onDeactivate()
					}
				>
					<ScIcon
						slot="prefix"
						style={{ opacity: 0.5 }}
						name="x-circle"
					/>
					{__('Deactivate', 'surecart')}
				</ScButton>
			)}
		</>
	);
};

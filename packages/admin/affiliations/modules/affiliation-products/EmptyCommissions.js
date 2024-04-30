/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScEmpty, ScIcon } from '@surecart/components-react';

export default function ({ openModal }) {
	return (
		<ScEmpty icon="percent">
			{__(
				'Add a product-specific commission for this affiliate.',
				'surecart'
			)}

			<ScButton onClick={openModal}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add Commission', 'surecart')}
			</ScButton>
		</ScEmpty>
	);
}

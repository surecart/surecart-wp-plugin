/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScEmpty, ScIcon } from '@surecart/components-react';

export default function ({ setModal, loading }) {
	return (
		<ScEmpty icon="percent">
			{__(
				'No product commissions found. Add a new product commission.',
				'surecart'
			)}

			<ScButton onClick={() => setModal('create')}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add Commission', 'surecart')}
			</ScButton>
		</ScEmpty>
	);
}

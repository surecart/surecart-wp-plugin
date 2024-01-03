/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ loading, upsell, updateUpsell }) => {
	return (
		<Box title={__('Name', 'surecart')} loading={loading}>
			<ScInput
				label={__('Upsell Name', 'surecart')}
				required
				help={__(
					'A name for this upsell that will be visible to customers.',
					'surecart'
				)}
				onScInput={(e) => updateUpsell({ name: e.target.value })}
				value={upsell?.name}
				name="name"
			/>
		</Box>
	);
};

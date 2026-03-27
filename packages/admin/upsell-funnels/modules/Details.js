/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ loading, funnel, updateFunnel }) => {
	return (
		<Box title={__('Details', 'surecart')} loading={loading}>
			<ScInput
				label={__('Name', 'surecart')}
				required
				help={__(
					'Internal upsell funnel name. This is not visible to customers.',
					'surecart'
				)}
				onScInput={(e) => updateFunnel({ name: e.target.value })}
				value={funnel?.name}
			/>
		</Box>
	);
};

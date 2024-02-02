import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ upsell, updateUpsell, loading }) => {
	return (
		<Box title={__('Priority', 'surecart')} loading={loading}>
			<ScInput
				label={__('Upsell Priority (1-5)')}
				help={__(
					'The priority of this upsell in relation to other upsells. The higher the number, the higher the priority.'
				)}
				type="number"
				min="1"
				max="5"
				step="1"
				value={upsell?.priority}
				onScInput={(e) =>
					updateUpsell({ priority: parseInt(e.target.value) })
				}
			/>
		</Box>
	);
};

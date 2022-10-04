import { ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ bump, updateBump, loading }) => {
	return (
		<Box title={__('Priority', 'surecart')} loading={loading}>
			<ScInput
				label={__('Bump Priority (1-5)')}
				help={__(
					'The priority of this bump in relation to other bumps. The higher the number, the higher the priority.'
				)}
				type="number"
				min="1"
				max="5"
				step="1"
				value={bump?.priority}
				onScInput={(e) =>
					updateBump({ priority: parseInt(e.target.value) })
				}
			/>
		</Box>
	);
};

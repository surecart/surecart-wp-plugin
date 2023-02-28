import { ScInput, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ loading, bump, updateBump }) => {
	return (
		<Box title={__('Name', 'surecart')} loading={loading}>
			<ScInput
				label={__('Bump Name', 'surecart')}
				required
				help={__(
					'A name for this bump that will be visible to customers.',
					'surecart'
				)}
				onScInput={(e) => updateBump({ name: e.target.value })}
				value={bump?.name}
				name="name"
			/>
		</Box>
	);
};

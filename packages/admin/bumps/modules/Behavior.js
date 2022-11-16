import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ bump, updateBump, loading }) => {
	return (
		<Box title={__('Behavior', 'surecart')} loading={loading}>
			<ScSwitch
				checked={bump?.auto_apply}
				onScChange={(e) => {
					updateBump({ auto_apply: e.target.checked });
				}}
				reversed
			>
				{__('Auto Apply')}
				<span slot="description">
					{__(
						'Automatically apply the order bump if the customer has the required items in the cart.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</Box>
	);
};

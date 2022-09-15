import { ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '../../components/PriceSelector';
import useEntity from '../../mixins/useEntity';
import Box from '../../ui/Box';

export default ({ loading, bump, updateBump }) => {
	return (
		<Box title={__('Price', 'surecart')} loading={loading}>
			<ScFormControl
				label={__('Order Bump Price', 'surecart')}
				help={__('This is the price for the bump.', 'surecart')}
			>
				<PriceSelector
					required
					value={bump?.price?.id || bump?.price}
					ad_hoc={false}
					onSelect={(price) => updateBump({ price })}
					requestQuery={{
						archived: false,
					}}
				/>
			</ScFormControl>
		</Box>
	);
};

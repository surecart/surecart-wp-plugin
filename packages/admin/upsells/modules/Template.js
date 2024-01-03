import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

import SelectTemplate from '../components/SelectTemplate';
import SelectTemplatePart from '../components/SelectTemplatePart';

export default ({ upsell, updateUpsell, loading }) => {
	return (
		<Box title={__('Template', 'surecart')} loading={loading}>
			{scData?.is_block_theme ? (
				<SelectTemplate
					upsell={upsell}
					updateUpsell={updateUpsell}
				/>
			) : (
				<SelectTemplatePart
					upsell={upsell}
					updateUpsell={updateUpsell}
				/>
			)}
		</Box>
	);
};

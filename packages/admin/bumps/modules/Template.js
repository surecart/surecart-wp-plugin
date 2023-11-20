import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

import SelectTemplate from '../components/SelectTemplate';
import SelectTemplatePart from '../components/SelectTemplatePart';

export default ({ bump, updateBump, loading }) => {
	return (
		<Box title={__('Template', 'surecart')} loading={loading}>
			{scData?.is_block_theme ? (
				<SelectTemplate
					bump={bump}
					updateBump={updateBump}
				/>
			) : (
				<SelectTemplatePart
					bump={bump}
					updateBump={updateBump}
				/>
			)}
		</Box>
	);
};

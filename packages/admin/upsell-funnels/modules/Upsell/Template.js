import { __ } from '@wordpress/i18n';

import SelectTemplate from '../../components/SelectTemplate';
import SelectTemplatePart from '../../components/SelectTemplatePart';

export default ({ upsell, updateUpsell, loading }) => {
	return (
		<>
			{scData?.is_block_theme ? (
				<SelectTemplate upsell={upsell} updateUpsell={updateUpsell} />
			) : (
				<SelectTemplatePart
					upsell={upsell}
					updateUpsell={updateUpsell}
				/>
			)}
		</>
	);
};

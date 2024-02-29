import { __ } from '@wordpress/i18n';

import SelectTemplate from '../../components/SelectTemplate';
import SelectTemplatePart from '../../components/SelectTemplatePart';

export default (props) => {
	return (
		<>
			{scData?.is_block_theme ? (
				<SelectTemplate {...props} />
			) : (
				<SelectTemplatePart {...props} />
			)}
		</>
	);
};

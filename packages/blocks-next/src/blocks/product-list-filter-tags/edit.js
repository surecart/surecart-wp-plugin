import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [['surecart/product-list-filter-tag']];

export default ({ clientId, __unstableLayoutClassNames }) => {
	return (
		<TemplateListEdit
			template={TEMPLATE}
			blockContexts={[
				{
					'surecart/filterTag/name': __('Filter 1'),
				},
				{
					'surecart/filterTag/name': __('Filter 2'),
				},
				{
					'surecart/filterTag/name': __('Filter 3'),
				},
			]}
			className={__unstableLayoutClassNames}
			clientId={clientId}
		/>
	);
};

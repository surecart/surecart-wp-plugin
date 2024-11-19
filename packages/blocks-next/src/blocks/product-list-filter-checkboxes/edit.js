import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [['surecart/product-list-filter-checkbox']];

export default ({ clientId, __unstableLayoutClassNames }) => {
	return (
		<TemplateListEdit
			template={TEMPLATE}
			blockContexts={[
				{
					'surecart/checkbox/id': 'filter-1',
					'surecart/checkbox/name': __('Filter 1'),
				},
				{
					'surecart/checkbox/id': 'filter-2',
					'surecart/checkbox/name': __('Filter 2'),
				},
				{
					'surecart/checkbox/id': 'filter-3',
					'surecart/checkbox/name': __('Filter 3'),
				},
			]}
			className={__unstableLayoutClassNames}
			clientId={clientId}
		/>
	);
};

import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import { useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [['surecart/product-list-filter-tag']];

export default ({ clientId }) => {
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
			itemProps={useBlockProps()}
			clientId={clientId}
		/>
	);
};

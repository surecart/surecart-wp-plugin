import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import { useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [['surecart/product-list-filter-tag']];

export default ({ clientId, __unstableLayoutClassNames }) => {
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});
	return (
		<div {...blockProps}>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={[
					{
						id: 'filter-1',
						'surecart/filterTag/name': __('Filter 1', 'surecart'),
					},
					{
						id: 'filter-2',
						'surecart/filterTag/name': __('Filter 2', 'surecart'),
					},
					{
						id: 'filter-3',
						'surecart/filterTag/name': __('Filter 3', 'surecart'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
			/>
		</div>
	);
};

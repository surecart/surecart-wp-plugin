import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import { useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [['surecart/product-list-sort-radio']];

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
						id: 'date:desc',
						'surecart/radio/name': __('Latest'),
					},
					{
						id: 'date:asc',
						'surecart/radio/name': __('Oldest'),
					},
					{
						id: 'title:asc',
						'surecart/radio/name': __('Alphabetical, A-Z'),
					},
					{
						id: 'title:asc',
						'surecart/radio/name': __('Alphabetical, Z-A'),
					},
					{
						id: 'price:desc',
						'surecart/radio/name': __('Price, low to high'),
					},
					{
						id: 'price:asc',
						'surecart/radio/name': __('Price, high to low'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};

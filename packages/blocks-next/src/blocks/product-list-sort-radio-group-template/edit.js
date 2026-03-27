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
						'surecart/radio/name': __('Latest', 'surecart'),
					},
					{
						id: 'date:asc',
						'surecart/radio/name': __('Oldest', 'surecart'),
					},
					{
						id: 'title:asc',
						'surecart/radio/name': __(
							'Alphabetical, A-Z',
							'surecart'
						),
					},
					{
						id: 'title:desc',
						'surecart/radio/name': __(
							'Alphabetical, Z-A',
							'surecart'
						),
					},
					{
						id: 'price:desc',
						'surecart/radio/name': __(
							'Price, low to high',
							'surecart'
						),
					},
					{
						id: 'price:asc',
						'surecart/radio/name': __(
							'Price, high to low',
							'surecart'
						),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};

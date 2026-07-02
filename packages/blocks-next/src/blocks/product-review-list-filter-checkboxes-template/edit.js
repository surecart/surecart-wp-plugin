/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [['surecart/product-review-list-filter-checkbox']];

const FILTER_TEMPLATE = [
	{
		id: '5',
		'surecart/checkbox/name': __('5 Stars (10)', 'surecart'),
	},
	{
		id: '4',
		'surecart/checkbox/name': __('4 Stars (5)', 'surecart'),
	},
	{
		id: '3',
		'surecart/checkbox/name': __('3 Stars (0)', 'surecart'),
	},
	{
		id: '2',
		'surecart/checkbox/name': __('2 Stars (0)', 'surecart'),
	},
	{
		id: '1',
		'surecart/checkbox/name': __('1 Star (2)', 'surecart'),
	},
];

export default ({ clientId, __unstableLayoutClassNames }) => {
	const blockCount = useSelect((select) =>
		select(blockEditorStore).getBlockCount(clientId)
	);

	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});

	return (
		<div {...blockProps}>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={FILTER_TEMPLATE}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={
					blockCount ? undefined : InnerBlocks.ButtonBlockAppender
				}
			/>
		</div>
	);
};

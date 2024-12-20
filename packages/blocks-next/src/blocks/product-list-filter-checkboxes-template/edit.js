import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [['surecart/product-list-filter-checkbox']];

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
				blockContexts={[
					{
						id: 'filter-1',
						'surecart/checkbox/name': __('Filter 1'),
					},
					{
						id: 'filter-2',
						'surecart/checkbox/name': __('Filter 2'),
					},
					{
						id: 'filter-3',
						'surecart/checkbox/name': __('Filter 3'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={
					blockCount ? undefined : InnerBlocks.ButtonBlockAppender
				}
			/>
		</div>
	);
};

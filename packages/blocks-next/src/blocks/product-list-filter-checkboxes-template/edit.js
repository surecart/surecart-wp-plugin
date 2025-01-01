import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import {
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEntityRecords } from '@wordpress/core-data';
import { Spinner } from '@wordpress/components';

const TEMPLATE = [['surecart/product-list-filter-checkbox']];

const FALLBACK_FILTER_TEMPLATE = [
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
];

export default ({
	clientId,
	__unstableLayoutClassNames,
	context: { taxonomySlug },
}) => {
	const blockCount = useSelect((select) =>
		select(blockEditorStore).getBlockCount(clientId)
	);

	// Fetch taxonomy terms
	const { records: terms, hasResolved } = useEntityRecords(
		'taxonomy',
		taxonomySlug,
		{
			per_page: -1,
			hide_empty: true,
		}
	);

	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});

	// Create template contexts from terms
	const termTemplates =
		terms?.map((term) => ({
			id: term.id.toString(),
			'surecart/checkbox/name': term.name,
		})) || [];

	// Use fallback if no terms
	const templateContexts = termTemplates.length
		? termTemplates
		: FALLBACK_FILTER_TEMPLATE;

	if (!hasResolved) {
		return (
			<div
				{...blockProps}
				style={{
					display: 'flex',
					justifyContent: 'center',
					padding: '20px',
				}}
			>
				<Spinner />
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={templateContexts}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={
					blockCount ? undefined : InnerBlocks.ButtonBlockAppender
				}
			/>
		</div>
	);
};

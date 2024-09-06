import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TaxonomyControls } from './TaxonomyControls';
import KeywordControls from './KeywordControls';

export default function ProductListInspectorControls({
	onUpdateQuery,
	attributes,
}) {
	const {
		query,
		query: { taxQuery },
	} = attributes;

	return (
		<InspectorControls>
			<ToolsPanel
				className="block-library-query-toolspanel__filters" // unused but kept for backward compatibility
				label={__('Filters', 'surecart')}
				resetAll={() => {
					onUpdateQuery({
						author: '',
						parents: [],
						search: '',
						taxQuery: null,
					});
				}}
				dropdownMenuProps={{
					popoverProps: {
						placement: 'left-start',
						// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
						offset: 259,
					},
				}}
			>
				<ToolsPanelItem
					label={__('Taxonomies', 'surecart')}
					hasValue={() =>
						Object.values(taxQuery || {}).some(
							(terms) => !!terms.length
						)
					}
					onDeselect={() => onUpdateQuery({ taxQuery: null })}
				>
					<TaxonomyControls onChange={onUpdateQuery} query={query} />
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => !!query.search}
					label={__('Keyword', 'surecart')}
					onDeselect={() => onUpdateQuery({ search: null })}
				>
					<KeywordControls onChange={onUpdateQuery} query={query} />
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}

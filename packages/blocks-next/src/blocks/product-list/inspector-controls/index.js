import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	TextControl,
} from '@wordpress/components';
import { useCallback, useState, useEffect } from '@wordpress/element';
import { debounce } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { TaxonomyControls } from './TaxonomyControls';

export default function ProductListInspectorControls({
	onUpdateQuery,
	attributes,
}) {
	const { query } = attributes;
	const { taxQuery } = query;

	const [querySearch, setQuerySearch] = useState(query.search);
	const onChangeDebounced = useCallback(
		debounce(() => {
			if (query.search !== querySearch) {
				onUpdateQuery({ search: querySearch });
			}
		}, 250),
		[querySearch, query.search]
	);
	useEffect(() => {
		onChangeDebounced();
		return onChangeDebounced.cancel;
	}, [querySearch, onChangeDebounced]);

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
					setQuerySearch('');
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
					hasValue={() => !!querySearch}
					label={__('Keyword', 'surecart')}
					onDeselect={() => setQuerySearch('')}
				>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Keyword', 'surecart')}
						value={querySearch}
						onChange={setQuerySearch}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}

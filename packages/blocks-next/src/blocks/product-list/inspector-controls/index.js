/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { SelectControl } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { TaxonomyControls } from './TaxonomyControls';
import KeywordControls from './KeywordControls';
import IncludeControls from './IncludeControls';

const sortingOptions = [
	{
		label: __('Latest', 'surecart'),
		value: 'date:desc',
	},
	{
		label: __('Oldest', 'surecart'),
		value: 'date:asc',
	},
	{
		label: __('Price, low to high', 'surecart'),
		value: 'price:asc',
	},
	{
		label: __('Price, high to low', 'surecart'),
		value: 'price:desc',
	},
	{
		label: __('Alphabetical, A-Z', 'surecart'),
		value: 'title:asc',
	},
	{
		label: __('Alphabetical, Z-A', 'surecart'),
		value: 'title:desc',
	},
];

/**
 * Product List Inspector Controls
 */
export default function ProductListInspectorControls({
	onUpdateQuery,
	setAttributes,
	attributes: {
		type,
		query,
		query: { perPage, offset, taxQuery, order, orderBy },
	},
}) {
	const isMobile = useViewportMatch('medium', '<');
	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
				<RangeControl
					label={__('Products Per Page', 'surecart')}
					value={perPage}
					onChange={(perPage) => onUpdateQuery({ perPage })}
					step={1}
					min={1}
					max={40}
				/>

				<RangeControl
					label={__('Offset', 'surecart')}
					value={offset}
					onChange={(offset) => onUpdateQuery({ offset })}
					step={1}
					min={0}
					max={100}
				/>

				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={__('Default Sorting', 'surecart')}
					options={sortingOptions}
					value={`${orderBy}:${order}`}
					onChange={(selectSort) => {
						const sort = selectSort?.split(':');
						onUpdateQuery({
							order: sort[1],
							orderBy: sort[0],
						});
					}}
				/>
			</PanelBody>

			<PanelBody title={__('Products', 'surecart')}>
				<SelectControl
					label={__('Products To Show', 'surecart')}
					value={type}
					options={[
						{
							value: 'all',
							label: __('All Products', 'surecart'),
						},
						{
							value: 'featured',
							label: __('Featured Products', 'surecart'),
						},
						{
							value: 'custom',
							label: __('Hand Pick Products', 'surecart'),
						},
					]}
					onChange={(type) => setAttributes({ type })}
				/>

				{type === 'custom' && (
					<IncludeControls onChange={onUpdateQuery} query={query} />
				)}
			</PanelBody>

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
				dropdownMenuProps={
					isMobile
						? {}
						: {
								popoverProps: {
									placement: 'left-start',
									// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
									offset: 259,
								},
						  }
				}
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

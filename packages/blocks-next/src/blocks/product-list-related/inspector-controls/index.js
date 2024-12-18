/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	ToggleControl,
	SelectControl,
	PanelBody,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';

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
		label: __('Random (pagination disabled)', 'surecart'),
		value: 'rand:asc',
	},
];

/**
 * Product List Inspector Controls
 */
export default function ProductListInspectorControls({
	onUpdateQuery,
	attributes: {
		query: { perPage, pages, order, orderBy, taxonomy, fallback, shuffle },
	},
}) {
	const { records: allTaxonomies } = useEntityRecords('root', 'taxonomy', {
		per_page: -1,
	});

	// get all visible taxonomies for this post type.
	const taxonomies = (allTaxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes('sc_product') && taxonomy?.visibility.public
	);

	useEffect(() => {
		if (orderBy === 'rand') {
			onUpdateQuery({ pages: 1 });
		}
	}, [orderBy]);

	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
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

				{Array.isArray(taxonomies) && (
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={__('Taxonomy')}
						options={taxonomies.map((t) => ({
							label: t.name,
							value: t.slug,
						}))}
						value={taxonomy}
						onChange={(taxonomy) => onUpdateQuery({ taxonomy })}
					/>
				)}

				<RangeControl
					label={__('Products Per Page', 'surecart')}
					value={perPage}
					onChange={(perPage) => onUpdateQuery({ perPage })}
					step={1}
					min={1}
					max={40}
				/>

				{orderBy !== 'rand' && (
					<RangeControl
						label={__('Max pages to show', 'surecart')}
						value={pages}
						onChange={(pages) => onUpdateQuery({ pages })}
						step={1}
						min={1}
						max={10}
						help={__(
							'Limit the pages you want to show, even if the query has more results.',
							'surecart'
						)}
					/>
				)}

				<ToggleControl
					label={__('All Products Fallback', 'surecart')}
					help={__(
						'If there are no related products, show all products.',
						'surecart'
					)}
					checked={fallback}
					onChange={(fallback) => onUpdateQuery({ fallback })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

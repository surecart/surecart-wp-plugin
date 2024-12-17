/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { SelectControl } from '@wordpress/components';

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
];

/**
 * Product List Inspector Controls
 */
export default function ProductListInspectorControls({
	onUpdateQuery,
	attributes: {
		query: { perPage, order, orderBy },
	},
}) {
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
		</InspectorControls>
	);
}

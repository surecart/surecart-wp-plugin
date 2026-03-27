/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

export function QueryPaginationArrowSizeControl({ value, onChange }) {
	return (
		<RangeControl
			label={__('Arrow Size', 'surecart')}
			value={value}
			onChange={onChange}
			min={12}
			max={48}
			help={__('Size of the pagination arrows in pixels.', 'surecart')}
		/>
	);
}

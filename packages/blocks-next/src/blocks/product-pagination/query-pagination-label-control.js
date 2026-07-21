/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

export function QueryPaginationLabelControl({ value, onChange }) {
	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={__('Show label text', 'surecart')}
			help={__(
				'Toggle off to hide the label text, e.g. "Next Page".',
				'surecart'
			)}
			onChange={onChange}
			checked={value === true}
		/>
	);
}

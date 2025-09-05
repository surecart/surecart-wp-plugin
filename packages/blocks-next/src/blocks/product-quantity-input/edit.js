import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-form-control sc-quantity-selector__control',
		min: '1',
		step: '1',
		autocomplete: 'off',
		role: 'spinbutton',
		type: 'number',
		value: 1,
		'aria-label': __('Quantity', 'surecart'),
	});
	return <input {...blockProps} />;
};

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps({
		min: '1',
		step: '1',
		autoComplete: 'off',
		role: 'spinbutton',
		type: 'number',
		value: 1,
		readOnly: true,
		'aria-label': __('Quantity', 'surecart'),
	});
	return <input {...blockProps} />;
};

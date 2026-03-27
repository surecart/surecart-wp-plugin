import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { 'surecart/radio/name': name } }) => {
	const blockProps = useBlockProps({
		className: 'sc-form-check',
	});

	return (
		<div {...blockProps}>
			<input className="sc-check-input" type="radio" />
			<label>{name}</label>
		</div>
	);
};

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { 'surecart/checkbox/name': name } }) => {
	const blockProps = useBlockProps({
		className: 'sc-form-check',
	});

	return (
		<div {...blockProps}>
			<input className="sc-check-input" type="checkbox" />
			<label>{name}</label>
		</div>
	);
};

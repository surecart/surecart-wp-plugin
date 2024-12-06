import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { 'surecart/radio/name': name } }) => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<input type="radio" />
			<label>{name}</label>
		</div>
	);
};

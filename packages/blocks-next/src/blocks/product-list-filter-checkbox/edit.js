import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context: { 'surecart/checkbox/name': name } }) => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<input type="checkbox" />
			<label>{name}</label>
		</div>
	);
};

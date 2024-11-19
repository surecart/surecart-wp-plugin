import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({
	context: { 'surecart/checkbox/name': name, 'surecart/checkbox/id': id },
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<input type="checkbox" id={id} />
			<label for={id}>{name}</label>
		</div>
	);
};

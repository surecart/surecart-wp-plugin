import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ScIcon } from '@surecart/components-react';

export default ({
	context: { 'surecart/filterTag/name': name },
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className:
			'sc-tag sc-tag--default sc-tag--medium' +
			__unstableLayoutClassNames,
		role: 'button',
	});

	return (
		<div {...blockProps}>
			<span className="tag__content">{name}</span>
			<ScIcon
				name="x"
				className="sc-tag__clear"
				aria-label={__('Remove tag', 'surecart')}
			/>
		</div>
	);
};

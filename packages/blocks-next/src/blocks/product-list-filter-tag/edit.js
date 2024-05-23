import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Icon from '../../components/Icon';

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
			<Icon
				name="x"
				className="sc-tag__clear"
				aria-label={__('Remove tag', 'surecart')}
			/>
		</div>
	);
};

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({
	context: { 'surecart/productCollectionTag/name': name },
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `sc-tag sc-tag--default sc-tag--medium ${__unstableLayoutClassNames}`,
		role: 'button',
	});
	return <span {...blockProps}>{name}</span>;
};

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({
	context: { 'surecart/productCollectionTag/name': name },
	__unstableLayoutClassNames,
}) => {
	const blockProps = useBlockProps({
		className: `sc-product-collection-badge ${__unstableLayoutClassNames}`,
		role: 'button',
	});
	return <span {...blockProps}>{name}</span>;
};

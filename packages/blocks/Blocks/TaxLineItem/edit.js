import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const blockProps = useBlockProps();
	return <sc-line-item-tax {...blockProps}></sc-line-item-tax>;
};

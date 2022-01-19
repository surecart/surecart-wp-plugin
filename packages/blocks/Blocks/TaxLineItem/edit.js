import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const blockProps = useBlockProps();
	return <ce-line-item-tax {...blockProps}></ce-line-item-tax>;
};

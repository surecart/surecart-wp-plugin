import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	return <span {...blockProps}>2</span>;
};

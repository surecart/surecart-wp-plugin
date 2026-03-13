import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	return <span {...blockProps}>{scData?.currency_symbol}135.79</span>;
};

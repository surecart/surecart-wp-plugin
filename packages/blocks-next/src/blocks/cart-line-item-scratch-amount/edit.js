import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	return <div {...blockProps}>{scData?.currency_symbol}10</div>;
};

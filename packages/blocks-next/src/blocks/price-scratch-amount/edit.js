import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-price__amount',
	});

	return <span {...blockProps}>{scData?.currency_symbol}20</span>;
};

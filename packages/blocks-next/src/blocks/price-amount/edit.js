import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { display_amount } = context['surecart/price'];

	if (display_amount) {
		return <div {...blockProps}>{display_amount}</div>;
	}

	return <div {...blockProps}>{scData?.currency_symbol}10</div>;
};

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getFormattedPrice } from '../../utilities/currency';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { display_amount } = context['surecart/price'];

	if (display_amount) {
		return <div {...blockProps}>{display_amount}</div>;
	}

	return (
		<div {...blockProps}>
			{getFormattedPrice({
				amount: 1000,
				currency: scData?.currency,
			})}
		</div>
	);
};

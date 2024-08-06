import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getFormattedPrice } from '../../../../admin/util';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { display_amount, short_interval_text } = context['surecart/price'];

	if (display_amount) {
		return (
			<div {...blockProps}>
				{display_amount} {short_interval_text}
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{getFormattedPrice({
				amount: 10,
				currency: scData?.currency,
			})} / mo
		</div>
	);
};

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getFormattedPrice } from '../../../../admin/util';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { setup_fee_text } = context['surecart/price'];
	const signUpFeeAmount = getFormattedPrice({
		amount: 1200,
		currency: scData?.currency,
	});

	return (
		<div {...blockProps}>
			{setup_fee_text || signUpFeeAmount + __(' Signup Fee', 'surecart')}
		</div>
	);
};

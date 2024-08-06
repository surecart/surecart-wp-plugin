import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { setup_fee_text } = context['surecart/price'];
	return (
		<div {...blockProps}>
			{setup_fee_text || scData?.currency_symbol + __('12 Signup Fee', 'surecart')}
		</div>
	);
};

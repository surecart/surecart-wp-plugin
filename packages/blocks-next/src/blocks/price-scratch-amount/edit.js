import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { getFormattedPrice } from '../../utilities/currency';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-price__amount',
	});

	return (
		<span {...blockProps}>
			{getFormattedPrice({
				amount: 2000,
				currency: scData?.currency,
			})}
		</span>
	);
};

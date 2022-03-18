import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';
import { CeChoice, CeFormatNumber } from '@checkout-engine/components-react';

export default ({ attributes, isSelected }) => {
	const { amount, currency } = attributes;

	const blockProps = useBlockProps();

	return (
		<CeChoice
			showControl={false}
			size="small"
			value={amount}
			{...blockProps}
		>
			<CeFormatNumber
				type="currency"
				currency={currency || 'USD'}
				value={amount}
				minimum-fraction-digits="0"
			></CeFormatNumber>
		</CeChoice>
	);
};

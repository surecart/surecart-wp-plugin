import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';
import { ScChoice, ScFormatNumber } from '@surecart/components-react';

export default ({ attributes, isSelected }) => {
	const { amount, currency } = attributes;

	const blockProps = useBlockProps();

	return (
		<ScChoice
			showControl={false}
			size="small"
			value={amount}
			{...blockProps}
		>
			<ScFormatNumber
				type="currency"
				currency={currency || 'USD'}
				value={amount}
				minimum-fraction-digits="0"
			></ScFormatNumber>
		</ScChoice>
	);
};

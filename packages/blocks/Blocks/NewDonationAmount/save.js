/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export default ({ attributes }) => {
	const { label, amount, currency, custom_amount } = attributes;

	return (
		<sc-choice show-control="false" size="small" value={amount}>
			{!!label ? (
				label
			) : (
				!! custom_amount ? (
					<sc-price-input
						currencyCode={currency}
						size="small"
						showCode={false}
						showLabel={false}
						css={css`
							width: 6.1em;
						`}
					/>
				) : (
					<sc-format-number
						type="currency"
						currency={currency || 'USD'}
						value={amount}
						minimum-fraction-digits="0"
					/>
				)
			)}
		</sc-choice>
	);
};

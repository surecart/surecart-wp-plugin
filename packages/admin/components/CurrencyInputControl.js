/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { getCurrencySymbol } from '../util';
import { ScInput } from '@surecart/components-react';

export default (props) => {
	const {
		currency,
		currencies,
		attribute,
		label,
		currencyAttribute = 'currency',
		value,
		onChange,
		onChangeCurrency,
		className,
		...rest
	} = props;

	return (
		<ScInput
			label={label}
			className="sc-price-amount"
			value={value / 100 || null}
			onChange={(e) => {
				onChange(e.detail * 100);
			}}
			type="number"
			min="0.00"
			step="0.001"
			required
			{...rest}
		>
			<span
				slot="prefix"
				css={css`
					opacity: 0.65;
				`}
			>
				{getCurrencySymbol(currency)}
			</span>
		</ScInput>
	);
};

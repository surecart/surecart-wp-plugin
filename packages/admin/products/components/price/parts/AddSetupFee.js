/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScInput, ScPriceInput, ScSwitch } from '@surecart/components-react';
import { useEffect, useState } from 'react';

export default ({ price, updatePrice }) => {
	const [addSetupFee, setAddSetupFee] = useState(false);

	useEffect(() => {
		if (price?.setup_fee_name && price?.setup_fee_amount) {
			setAddSetupFee(true);
		}
	}, [price?.setup_fee_name, price?.setup_fee_amount]);

	const onToggleSwitch = (e) => {
		setAddSetupFee(e.target.checked);
		if (!e.target.checked) {
			delete price.setup_fee_amount;
			delete price.setup_fee_name;

			updatePrice({ ...price }, true);
		}
	};

	const isToggleDisabled = () => {
		return !!price && price?.setup_fee_name && price?.setup_fee_amount;
	};

	return (
		<>
			<ScSwitch
				checked={addSetupFee}
				onScChange={onToggleSwitch}
				disabled={isToggleDisabled()}
			>
				{__('Add setup fee', 'surecart')}
			</ScSwitch>

			{addSetupFee && (
				<div
					css={css`
						display: flex;
						gap: var(--sc-form-row-spacing);

						> * {
							flex: 1;
						}
					`}
				>
					<ScInput
						label={__('Setup fee name', 'surecart')}
						value={price?.setup_fee_name}
						onScInput={(e) => {
							updatePrice({
								setup_fee_name: e.target.value,
							});
						}}
						name="name"
					/>
					<ScPriceInput
						label={__('Setup fee amount', 'surecart')}
						currencyCode={price?.currency || scData.currency_code}
						value={price?.setup_fee_amount}
						onScInput={(e) =>
							updatePrice({
								setup_fee_amount: e.target.value,
							})
						}
					/>
				</div>
			)}
		</>
	);
};

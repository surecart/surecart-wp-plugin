/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScInput,
	ScPriceInput,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';

export default ({ upsell, onUpdate, loading }) => {
	const [type, setType] = useState('percentage');

	useEffect(() => {
		if (upsell?.amount_off) {
			setType('fixed');
		}
	}, [upsell?.amount_off]);

	return (
		<>
			<ScRadioGroup label={__('Type', 'surecart')}>
				<ScRadio
					checked={type === 'percentage'}
					onClick={() => setType('percentage')}
				>
					{__('Percentage discount', 'surecart')}
				</ScRadio>
				<ScRadio
					checked={type === 'fixed'}
					onClick={() => setType('fixed')}
				>
					{__('Fixed amount discount', 'surecart')}
				</ScRadio>
			</ScRadioGroup>

			{type === 'percentage' ? (
				<ScInput
					label={__('Percentage off', 'surecart')}
					className="sc-percent-off"
					type="number"
					disabled={type !== 'percentage'}
					min="0"
					max="100"
					step="0.01"
					attribute="percent_off"
					value={upsell?.percent_off || null}
					onScInput={(e) => {
						onUpdate({
							amount_off: null,
							percent_off: e.target.value,
						});
					}}
				>
					<span slot="suffix">%</span>
				</ScInput>
			) : (
				<ScPriceInput
					label={__('Discount amount', 'surecart')}
					className="sc-amount-off"
					currencyCode={scData?.currency}
					disabled={type === 'percentage'}
					attribute="amount_off"
					value={upsell?.amount_off || null}
					onScInput={(e) => {
						onUpdate({
							percent_off: null,
							amount_off: e.target.value,
						});
					}}
				/>
			)}
		</>
	);
};

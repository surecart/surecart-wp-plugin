/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScInput,
	ScPriceInput,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';

export default ({ upsell, onUpdate }) => {
	const [type, setType] = useState('none');
	const inputRef = useRef(null);

	useEffect(() => {
		if (upsell?.amount_off) {
			setType('fixed');
		}
	}, [upsell?.amount_off]);

	useEffect(() => {
		if (upsell?.percent_off) {
			setType('percentage');
		}
	}, [upsell?.percent_off]);

	return (
		<>
			<ScRadioGroup label={__('Discount', 'surecart')}>
				<ScRadio
					checked={type === 'none'}
					onClick={() => {
						setType('none');
						onUpdate({
							amount_off: null,
							percent_off: null,
						});
					}}
				>
					{__('No discount', 'surecart')}
				</ScRadio>
				<ScRadio
					checked={type === 'percentage'}
					onClick={() => {
						setType('percentage');
						setTimeout(() => {
							inputRef.current.triggerFocus();
						});
					}}
				>
					{__('Percentage discount', 'surecart')}
				</ScRadio>
				<ScRadio
					checked={type === 'fixed'}
					onClick={() => {
						setType('fixed');
						setTimeout(() => {
							inputRef.current.triggerFocus();
						});
					}}
				>
					{__('Fixed amount discount', 'surecart')}
				</ScRadio>
			</ScRadioGroup>
			{type === 'percentage' && (
				<ScInput
					ref={inputRef}
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
					required
				>
					<span slot="suffix">%</span>
				</ScInput>
			)}
			{type === 'fixed' && (
				<ScPriceInput
					ref={inputRef}
					label={__('Discount amount', 'surecart')}
					className="sc-amount-off"
					currencyCode={scData?.currency_code}
					disabled={type === 'percentage'}
					attribute="amount_off"
					value={upsell?.amount_off || null}
					onScInput={(e) => {
						onUpdate({
							percent_off: null,
							amount_off: e.target.value,
						});
					}}
					required
				/>
			)}
		</>
	);
};

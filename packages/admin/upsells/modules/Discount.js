/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import {
	ScFormControl,
	ScInput,
	ScPriceInput,
	ScFlex,
	ScSelect,
} from '@surecart/components-react';
import useEntity from '../../hooks/useEntity';

export default ({ upsell, updateUpsell, loading }) => {
	const [type, setType] = useState('percentage');

	const { price, hasLoadedPrice } = useEntity(
		'price',
		upsell?.price,
		{
			expand: ['product'],
		},
		[upsell?.price]
	);

	useEffect(() => {
		if (upsell?.amount_off) {
			setType('fixed');
		}
	}, [upsell?.amount_off]);

	return (
		<Box
			title={__('Discount', 'surecart')}
			loading={loading || !hasLoadedPrice}
		>
			<ScFlex
				flexDirection="column"
				style={{ '--sc-flex-column-gap': '1.5em' }}
			>
				<ScFormControl label={__('Discount Amount', 'surecart')}>
					<ScFlex>
						<ScSelect
							unselect={false}
							style={{ width: '25%' }}
							value={type}
							choices={[
								{
									label: __('Percentage', 'surecart'),
									value: 'percentage',
								},
								{
									label: __('Fixed', 'surecart'),
									value: 'fixed',
								},
							]}
							onScChange={(e) => setType(e.target.value)}
						/>
						{type === 'percentage' ? (
							<ScInput
								style={{ flex: 1 }}
								className="sc-percent-off"
								type="number"
								disabled={type !== 'percentage'}
								min="0"
								max="100"
								step="0.01"
								attribute="percent_off"
								value={upsell?.percent_off || null}
								onScInput={(e) => {
									updateUpsell({
										amount_off: null,
										percent_off: e.target.value,
									});
								}}
							>
								<span slot="suffix">%</span>
							</ScInput>
						) : (
							<ScPriceInput
								style={{ flex: 1 }}
								className="sc-amount-off"
								currencyCode={
									price?.currency || scData?.currency
								}
								disabled={type === 'percentage'}
								attribute="amount_off"
								value={upsell?.amount_off || null}
								onScInput={(e) => {
									updateUpsell({
										percent_off: null,
										amount_off: e.target.value,
									});
								}}
							/>
						)}
					</ScFlex>
				</ScFormControl>
			</ScFlex>
		</Box>
	);
};

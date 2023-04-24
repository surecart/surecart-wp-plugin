import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import Box from '../../ui/Box';
import {
	ScFormControl,
	ScInput,
	ScPriceInput,
	ScFlex,
	ScSelect,
} from '@surecart/components-react';
import useEntity from '../../hooks/useEntity';
import Behavior from './Behavior';

export default ({ bump, updateBump, loading }) => {
	const [type, setType] = useState('percentage');

	const { price, hasLoadedPrice } = useEntity(
		'price',
		bump?.price,
		{
			expand: ['product'],
		},
		[bump?.price]
	);

	useEffect(() => {
		if (bump?.amount_off) {
			setType('fixed');
		}
	}, [bump?.amount_off]);

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
								value={bump?.percent_off || null}
								onScInput={(e) => {
									updateBump({
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
								value={bump?.amount_off || null}
								onScInput={(e) => {
									updateBump({
										percent_off: null,
										amount_off: e.target.value,
									});
								}}
							/>
						)}
					</ScFlex>
				</ScFormControl>
				{(bump?.amount_off || bump?.percent_off) && (
					<ScFlex>
						<Behavior
							bump={bump}
							updateBump={updateBump}
							loading={loading}
						/>
					</ScFlex>
				)}
			</ScFlex>
		</Box>
	);
};

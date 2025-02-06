/**
 * External dependencies.
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScSwitch,
	ScInput,
	ScRadioGroup,
	ScRadio,
	ScPriceInput,
} from '@surecart/components-react';

export default ({
	commissionStructure,
	onChangeStructure,
	zeroCommissionAmountReferral = undefined,
	onEditAffiliationProtocolItem = () => {},
}) => {
	const type = commissionStructure?.amount_commission
		? 'fixed'
		: 'percentage';

	const [commisionType, setCommisionType] = useState(type);

	useEffect(() => {
		if (type !== commisionType) {
			setCommisionType(type);
		}
	}, [type]);

	return (
		<>
			<ScRadioGroup
				label={__('Select a commission type', 'surecart')}
				onScChange={(e) => setCommisionType(e.target.value)}
				required
			>
				<ScRadio
					value="percentage"
					checked={commisionType === 'percentage'}
				>
					{__('Percentage', 'surecart')}
				</ScRadio>
				<ScRadio value="fixed" checked={commisionType === 'fixed'}>
					{__('Flat Rate', 'surecart')}
				</ScRadio>
			</ScRadioGroup>

			{commisionType === 'percentage' ? (
				<ScInput
					type="number"
					min="0"
					disabled={commisionType !== 'percentage'}
					max="100"
					attribute="percent_commission"
					label={__('Percent Commission', 'surecart')}
					value={commissionStructure?.percent_commission || null}
					onScInput={(e) => {
						onChangeStructure({
							percent_commission: e.target.value,
							amount_commission: null,
						});
					}}
					required
				>
					<span slot="suffix">%</span>
				</ScInput>
			) : (
				<ScPriceInput
					currencyCode={scData?.currency_code}
					disabled={commisionType === 'percentage'}
					attribute="amount_commission"
					label={__('Amount Commission', 'surecart')}
					value={
						commissionStructure?.amount_commission || null || null
					}
					onScInput={(e) => {
						onChangeStructure({
							amount_commission: e.target.value,
							percent_commission: null,
						});
					}}
					required
				/>
			)}

			{zeroCommissionAmountReferral !== undefined && (
				<ScSwitch
					checked={zeroCommissionAmountReferral}
					onClick={(e) => {
						e.preventDefault();
						onEditAffiliationProtocolItem({
							zero_commission_amount_referrals_enabled:
								!zeroCommissionAmountReferral,
						});
					}}
				>
					{__('Zero Commission Referrals', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Whether or not to create a referral from a checkout when the resulting referral has a commission of zero. This is useful for tracking referrals that do not have a commission, such as when a customer uses a coupon code.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			)}

			<ScSwitch
				checked={commissionStructure?.recurring_commissions_enabled}
				onClick={(e) => {
					e.preventDefault();
					onChangeStructure({
						recurring_commissions_enabled:
							!commissionStructure?.recurring_commissions_enabled,
					});
				}}
			>
				{__('Subscription Commissions', 'surecart')}
				<span slot="description" style={{ lineHeight: '1.4' }}>
					{__(
						'Do you want to award commissions on subscription renewal payments?',
						'surecart'
					)}
				</span>
			</ScSwitch>

			{commissionStructure?.recurring_commissions_enabled && (
				<ScInput
					label={__('Subscription Commission Duration', 'surecart')}
					help={__(
						'For how long should subscription commissions be awarded? (Leave empty if you want to award commissions forever.)',
						'surecart'
					)}
					type="number"
					onScInput={(e) => {
						e.preventDefault();
						onChangeStructure({
							recurring_commission_days: e.target.value,
						});
					}}
					placeholder="∞"
					value={commissionStructure?.recurring_commission_days}
				>
					<span slot="suffix">{__('Days', 'surecart')}</span>
				</ScInput>
			)}

			<ScSwitch
				checked={
					commissionStructure?.repeat_customer_commissions_enabled
				}
				onClick={(e) => {
					e.preventDefault();
					onChangeStructure({
						repeat_customer_commissions_enabled:
							!commissionStructure?.repeat_customer_commissions_enabled,
					});
				}}
			>
				{__('Lifetime Commissions', 'surecart')}
				<span slot="description" style={{ lineHeight: '1.4' }}>
					{__(
						'Do you want to award commissions on future purchases?',
						'surecart'
					)}
				</span>
			</ScSwitch>

			{commissionStructure?.repeat_customer_commissions_enabled && (
				<ScInput
					label={__('Lifetime Commission Duration', 'surecart')}
					help={__(
						'For how long should future purchase commissions be awarded? (Leave empty if you want to award commission forever.)',
						'surecart'
					)}
					type="number"
					onScInput={(e) => {
						e.preventDefault();
						onChangeStructure({
							repeat_customer_commission_days: e.target.value,
						});
					}}
					placeholder="∞"
					value={commissionStructure?.repeat_customer_commission_days}
				>
					<span slot="suffix">{__('Days', 'surecart')}</span>
				</ScInput>
			)}
		</>
	);
};

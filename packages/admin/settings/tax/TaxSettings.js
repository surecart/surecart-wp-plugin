import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ScAddress,
	ScIcon,
	ScSelect,
	ScSwitch,
	ScInput,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import TaxRow from './TaxRow';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'tax_protocol'
	);

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<SettingsTemplate
			title={__('Taxes', 'surecart')}
			icon={<ScIcon name="tag" />}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Store Tax Settings', 'surecart')}
				description={__(
					'Manage how your store charges sales tax on orders, invoices, and subscriptions.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.tax_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							tax_enabled: !item?.tax_enabled,
						});
					}}
				>
					{__('Tax Collection', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If enabled, you need to configure which tax regions you have tax nexus. Tax will only be collected for tax regions that are enabled. If disabled, no tax will be collected.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={item?.default_tax_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							default_tax_enabled: !item?.default_tax_enabled,
						});
					}}
				>
					{__('Enable A Fallback Tax Rate', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If enabled, you can enter a tax rate to apply when a specific tax registration is not found.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				{item?.default_tax_enabled && (
					<ScInput
						type="number"
						label={__('Fallback Rate', 'surecart')}
						help={__(
							'The fallback tax rate to use for checkouts when a specific tax registration is not found.',
							'surecart'
						)}
						min="0"
						max="100"
						step="0.01"
						value={item?.default_rate}
						onScInput={(e) =>
							editItem({
								default_rate: e.target.value,
							})
						}
						required={item?.default_tax_enabled}
					>
						<span slot="suffix">%</span>
					</ScInput>
				)}
				<ScAddress
					label={__('Address', 'surecart')}
					required={false}
					showName={true}
					showLine2={true}
					address={item?.address}
					names={{}}
					onScInputAddress={(e) => editItem({ address: e.detail })}
				/>
			</SettingsBox>

			{item?.tax_enabled && (
				<SettingsBox
					title={__('EU VAT Settings', 'surecart')}
					description={__(
						'Change how your store manages EU VAT collection and validation.',
						'surecart'
					)}
					loading={!hasLoadedItem}
				>
					<ScSwitch
						checked={item?.eu_vat_required}
						onClick={(e) => {
							e.preventDefault();
							editItem({
								eu_vat_required: !item?.eu_vat_required,
							});
						}}
					>
						{__('Require VAT Number', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'If enabled, require all customer’s in the EU to enter a EU VAT number when checking out.',
								'surecart'
							)}
						</span>
					</ScSwitch>

					<ScSwitch
						checked={item?.eu_vat_local_reverse_charge}
						onClick={(e) => {
							e.preventDefault();
							editItem({
								eu_vat_local_reverse_charge:
									!item?.eu_vat_local_reverse_charge,
							});
						}}
					>
						{__('Local Reverse Charge', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'If enabled, apply reverse charge when applicable even when customers are in your home country.',
								'surecart'
							)}
						</span>
					</ScSwitch>

					<ScSelect
						label={__(
							'VAT Number Verification Failure',
							'surecart'
						)}
						value={item?.eu_vat_unverified_behavior}
						onScChange={(e) =>
							editItem({
								eu_vat_unverified_behavior: e.target.value,
							})
						}
						help={__(
							'Choose the checkout behavior when VAT verification fails.',
							'surecart'
						)}
						choices={[
							{
								value: 'error',
								label: __(
									'Reject the order and show an error.',
									'surecart'
								),
							},
							{
								value: 'skip_reverse_charge',
								label: __(
									'Accept the order but don’t apply reverse charge.',
									'surecart'
								),
							},
							{
								value: 'apply_reverse_charge',
								label: __(
									'Accept the order and apply reverse charge.',
									'surecart'
								),
							},
						]}
						required
					></ScSelect>
				</SettingsBox>
			)}

			<SettingsBox
				title={__('Tax Regions', 'surecart')}
				description={__(
					'Manage how your store charges sales tax within each tax region. Check with a tax expert to understand your tax obligations.',
					'surecart'
				)}
				loading={!hasLoadedItem}
				noButton
				wrapperTag={'div'}
			>
				<sc-card no-padding>
					<TaxRow
						icon={<ScIcon name="australia-flag" />}
						title={__('Australia', 'surecart')}
						region="au"
					/>
					<TaxRow
						icon={<ScIcon name="canada-flag" />}
						title={__('Canada', 'surecart')}
						region="ca"
					/>
					<TaxRow
						icon={<ScIcon name="eu-flag" />}
						title={__('European Union', 'surecart')}
						region="eu"
					/>
					<TaxRow
						icon={<ScIcon name="uk-flag" />}
						title={__('United Kingdom', 'surecart')}
						region="uk"
					/>
					<TaxRow
						icon={<ScIcon name="us-flag" />}
						title={__('United States', 'surecart')}
						region="us"
					/>
					<TaxRow
						icon={<ScIcon name="globe" />}
						title={__('Rest Of The World', 'surecart')}
						region="other"
					/>
				</sc-card>
			</SettingsBox>
		</SettingsTemplate>
	);
};

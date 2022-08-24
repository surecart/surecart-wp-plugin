import { __ } from '@wordpress/i18n';
import { ScSwitch, ScTaxIdInput } from '@surecart/components-react';
import SettingsBox from '../SettingsBox';

export default ({ region, item, editItem, loading }) => {
	if (region === 'ca') {
		return (
			<SettingsBox
				title={__('Canada GST/HST', 'surecart')}
				description={__(
					'Manage how your store collects GST/HST for all Canadian provinces.',
					'surecart'
				)}
				loading={loading}
			>
				<ScSwitch
					checked={item?.ca_tax_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							ca_tax_enabled: !item?.ca_tax_enabled,
						});
					}}
				>
					{__('Collect Canada GST/HST', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If enabled, your store will collect Canada GST/HST for all provinces. If you need to collect additional provincial taxes for Quebec, British Columbia, Manitoba, or Saskatchewan then you will need to additionally create separate tax registrations for these provinces.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!item?.ca_tax_enabled && (
					<ScTaxIdInput
						country={item?.ca_tax_identifier?.type || region}
						number={item?.ca_tax_identifier?.number}
						help={__(
							"In applicable tax jurisdictions, your tax ID will show on invoices. If you don't have your tax ID number yet, you can enter it later.",
							'surecart'
						)}
						onScInput={(e) =>
							editItem({ ca_tax_identifier: e.detail })
						}
					/>
				)}
			</SettingsBox>
		);
	}

	if (region === 'eu') {
		return (
			<SettingsBox
				title={__('Collect EU VAT', 'surecart')}
				description={__(
					'Manage how your store collects EU VAT for all EU countries.',
					'surecart'
				)}
				loading={loading}
			>
				<ScSwitch
					checked={item?.eu_tax_enabled}
					onClick={(e) => {
						e.preventDefault();
						editItem({
							eu_tax_enabled: !item?.eu_tax_enabled,
						});
					}}
				>
					{__('Collect EU VAT', 'surecart')}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'If enabled, your store will collect EU VAT for all EU countries. You should enable this option if you are registered via "One-Stop Shop" and plan to submit a single VAT return for all EU countries. If you are planning to submit separate VAT returns for each EU country then you should not enable this option. You should instead create separate tax registrations for each EU country.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!item?.eu_tax_enabled && (
					<ScSwitch
						checked={item?.eu_micro_exemption_enabled}
						onClick={(e) => {
							e.preventDefault();
							editItem({
								eu_micro_exemption_enabled:
									!item?.eu_micro_exemption_enabled,
							});
						}}
					>
						{__('Micro-Business Exemption', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Enable this if your business makes up to €10,000 EUR in sales to other EU countries and you only plan to submit a domestic VAT return. If enabled, your home country VAT rate will apply to all EU orders.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				)}

				{!!item?.eu_tax_enabled && (
					<ScTaxIdInput
						country={item?.eu_tax_identifier?.type || region}
						number={item?.eu_tax_identifier?.number}
						help={__(
							"In applicable tax jurisdictions, your tax ID will show on invoices. If you don't have your tax ID number yet, you can enter it later.",
							'surecart'
						)}
						onScInput={(e) =>
							editItem({ eu_tax_identifier: e.detail })
						}
					/>
				)}
			</SettingsBox>
		);
	}

	return null;
};

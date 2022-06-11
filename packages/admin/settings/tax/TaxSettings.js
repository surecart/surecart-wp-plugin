import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScAddress, ScSwitch } from '@surecart/components-react';
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
			icon={<sc-icon name="tag"></sc-icon>}
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
						icon={<sc-icon name="australia-flag"></sc-icon>}
						title={__('Australia', 'surecart')}
						region="au"
					/>
					<TaxRow
						icon={<sc-icon name="canada-flag"></sc-icon>}
						title={__('Canada', 'surecart')}
						region="ca"
					/>
					<TaxRow
						icon={<sc-icon name="eu-flag"></sc-icon>}
						title={__('European Union', 'surecart')}
						region="eu"
					/>
					<TaxRow
						icon={<sc-icon name="uk-flag"></sc-icon>}
						title={__('United Kingdom', 'surecart')}
						region="uk"
					/>
					<TaxRow
						icon={<sc-icon name="us-flag"></sc-icon>}
						title={__('United States', 'surecart')}
						region="us"
					/>
				</sc-card>
			</SettingsBox>
		</SettingsTemplate>
	);
};

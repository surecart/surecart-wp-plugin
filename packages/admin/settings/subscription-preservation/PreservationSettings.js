/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSelect, ScSwitch, ScTag } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import Coupon from './Coupon';
import Locales from './Locales';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'subscription_protocol'
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

	const choices = [
		{
			label: __('Immediately', 'surecart'),
			value: 'immediate',
		},
		{
			label: __('Next Billing Period', 'surecart'),
			value: 'pending',
		},
	];

	return (
		<SettingsTemplate
			title={__('Subscription Saver & Cancelation Insights', 'surecart')}
			icon={<sc-icon name="bar-chart-2"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__(
					'Subscription Saver & Cancelation Insights',
					'surecart'
				)}
				description={__(
					'Manage your subscription saver settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={
						scData?.entitlements?.subscription_preservation
							? item?.preservation_enabled
							: true
					}
					disabled={!scData?.entitlements?.subscription_preservation}
					onScChange={(e) => {
						e.preventDefault();
						editItem({
							preservation_enabled: !item?.preservation_enabled,
						});
					}}
				>
					{__(
						'Enable Subscription Saver and Cancelation Insights',
						'surecart'
					)}
					{!scData?.entitlements?.subscription_preservation && (
						<ScTag type="success" size="small" pill>
							{__('Pro', 'surecart')}
						</ScTag>
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Turning this one will collect subscription cancelation reasons and optionally offer a discount to keep their subscription active.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			{!!item?.preservation_enabled && (
				<>
					<SettingsBox
						title={__('Discount', 'surecart')}
						description={__(
							'Manage your subscription saver settings discount.',
							'surecart'
						)}
						loading={!hasLoadedItem}
					>
						<Coupon coupon={item?.preservation_coupon} />
					</SettingsBox>

					<SettingsBox
						title={__('Interface', 'surecart')}
						description={__(
							'Manage your subscription saver settings discount.',
							'surecart'
						)}
						loading={!hasLoadedItem}
					>
						<Locales item={item} updateItem={editItem} />
					</SettingsBox>
				</>
			)}
		</SettingsTemplate>
	);
};

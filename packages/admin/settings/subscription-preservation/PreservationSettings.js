/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScIcon,
	ScInput,
	ScSelect,
	ScSwitch,
	ScTag,
	ScTextarea,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import Coupon from './Coupon';
import NewReason from './NewReason';
import Reasons from './Reasons';

export default () => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'subscription_protocol'
	);

	const {
		reasons_title,
		reasons_description,
		skip_link,
		preserve_title,
		preserve_description,
		preserve_button,
		cancel_link,
	} = item?.preservation_locales || {};

	const updateLocale = (data) => {
		updateItem({
			preservation_locales: {
				...item?.preservation_locales,
				...data,
			},
		});
	};

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
						title={__('Renewal Discount', 'surecart')}
						description={__(
							'Provide a discount to keep a subscription.',
							'surecart'
						)}
						loading={!hasLoadedItem}
					>
						<Coupon coupon={item?.preservation_coupon} />
						<ScInput
							label={__('Title', 'surecart')}
							value={preserve_title}
							onScInput={(e) =>
								updateLocale({ preserve_title: e.target.value })
							}
						/>
						<ScTextarea
							label={__('Description', 'surecart')}
							value={preserve_description}
							onScInput={(e) =>
								updateLocale({
									preserve_description: e.target.value,
								})
							}
						/>
						<ScInput
							label={__('Button', 'surecart')}
							value={preserve_button}
							onScInput={(e) =>
								updateLocale({
									preserve_button: e.target.value,
								})
							}
						/>
						<ScInput
							label={__('Cancel Link', 'surecart')}
							value={cancel_link}
							onScInput={(e) =>
								updateLocale({ cancel_link: e.target.value })
							}
						/>
					</SettingsBox>

					<SettingsBox
						title={__('Cancellation Survey', 'surecart')}
						description={__(
							'Cancellation survey options.',
							'surecart'
						)}
						loading={!hasLoadedItem}
					>
						<Reasons />
						<ScInput
							label={__('Title', 'surecart')}
							value={reasons_title}
							onScInput={(e) =>
								updateLocale({ reasons_title: e.target.value })
							}
						/>
						<ScTextarea
							label={__('Description', 'surecart')}
							value={reasons_description}
							onScInput={(e) =>
								updateLocale({
									reasons_description: e.target.value,
								})
							}
						/>
						<ScInput
							label={__('Skip Link', 'surecart')}
							value={skip_link}
							onScInput={(e) =>
								updateLocale({ skip_link: e.target.value })
							}
						/>
					</SettingsBox>
				</>
			)}
			{!!modal && <NewReason onRequestClose={() => setModal(false)} />}
		</SettingsTemplate>
	);
};

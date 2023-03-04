import {
	ScButton,
	ScIcon,
	ScInput,
	ScSwitch,
	ScTag,
	ScTextarea,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import Coupon from './Coupon';
import DiscountPreview from './DiscountPreview';
import NewReason from './EditReason';
import Reasons from './Reasons';
import SurveyPreview from './SurveyPreview';

export default () => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const [reasons, setReasons] = useState(null);
	const { editEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { save } = useSave();

	/** Get the subscription protocol item. */
	const { item, itemError, hasLoadedItem } = useSelect((select) => {
		const entityData = ['surecart', 'store', 'subscription_protocol'];
		return {
			item: select(coreStore)?.getEditedEntityRecord?.(...entityData),
			hasLoadedItem: select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...entityData]
			),
			itemError: select(coreStore)?.getResolutionError?.(
				'getEditedEntityRecord',
				...entityData
			),
		};
	});

	/** Add nested coupon to redux so we can pull it directly */
	useEffect(() => {
		if (item?.preservation_coupon?.id) {
			receiveEntityRecords('surecart', 'coupon', {
				...item?.preservation_coupon,
			});
		}
	}, [item?.preservation_coupon?.id]);

	/** Get edited coupon */
	const { coupon, couponError } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'coupon',
				[item?.preservation_coupon?.id || item?.preservation_coupon],
			];
			return {
				coupon: select(coreStore)?.getEditedEntityRecord?.(
					...entityData
				),
				couponError: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
			};
		},
		[item?.preservation_coupon?.id]
	);

	/** Update the coupon. */
	const editCoupon = (data) =>
		editEntityRecord('surecart', 'coupon', coupon?.id, data);

	/** Edit the protocol. */
	const editProtocol = (data) =>
		editEntityRecord('surecart', 'store', 'subscription_protocol', data);

	/** Update the protocol locale. */
	const updateLocale = (data) => {
		editProtocol({
			preservation_locales: {
				...item?.preservation_locales,
				...data,
			},
		});
	};

	/** Form is submitted. */
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

	// locales.
	const {
		reasons_title,
		reasons_description,
		skip_link,
		preserve_title,
		preserve_description,
		preserve_button,
		cancel_link,
	} = item?.preservation_locales || {};

	return (
		<SettingsTemplate
			title={__('Subscription Saver & Cancellation Insights', 'surecart')}
			icon={<sc-icon name="bar-chart-2"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || couponError | error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__(
					'Subscription Saver & Cancelation Insights',
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
						editProtocol({
							preservation_enabled: !item?.preservation_enabled,
						});
					}}
				>
					{__('Enabled', 'surecart')}
					{!scData?.entitlements?.subscription_preservation && (
						<ScTag type="success" size="small" pill>
							{__('Pro', 'surecart')}
						</ScTag>
					)}
					<span slot="description" style={{ lineHeight: '1.4' }}>
						{__(
							'Turning this on will collect subscription cancelation reasons and optionally offer a discount to keep their subscription active.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			{!!item?.preservation_enabled && (
				<>
					<SettingsBox
						title={__('Cancellation Survey', 'surecart')}
						description={__(
							'Cancellation survey options.',
							'surecart'
						)}
						loading={!hasLoadedItem}
						end={
							<SurveyPreview
								protocol={item}
								reasons={reasons}
								renderTrigger={({ setOpen }) => {
									return (
										<ScButton
											onClick={() => setOpen(true)}
											disabled={!reasons?.length}
										>
											<ScIcon name="eye" slot="suffix" />
											{__('Preview', 'surecart')}
										</ScButton>
									);
								}}
							/>
						}
					>
						<Reasons reasons={reasons} setReasons={setReasons} />

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
					<SettingsBox
						title={__('Renewal Discount', 'surecart')}
						description={__(
							'Provide a discount to keep a subscription.',
							'surecart'
						)}
						loading={!hasLoadedItem}
						end={
							<DiscountPreview
								protocol={item}
								coupon={coupon}
								renderTrigger={({ setOpen }) => {
									return (
										<ScButton onClick={() => setOpen(true)}>
											<ScIcon name="eye" slot="suffix" />
											{__('Preview', 'surecart')}
										</ScButton>
									);
								}}
							/>
						}
					>
						<Coupon coupon={coupon} updateCoupon={editCoupon} />
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
				</>
			)}

			{!!modal && <NewReason onRequestClose={() => setModal(false)} />}
		</SettingsTemplate>
	);
};

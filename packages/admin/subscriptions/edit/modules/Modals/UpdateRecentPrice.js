/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScAlert,
	ScButton,
	ScDialog,
	ScFormatNumber,
	ScSwitch,
	ScText,
} from '@surecart/components-react';
import { intervalString } from '../../../../util/translations';
import { formatNumber } from '../../../../util';

export default ({
	price,
	subscription,
	open,
	onUpdateRecentVersion,
	onRequestClose,
}) => {
	const [immediateUpdate, setImmediateUpdate] = useState(false);
	const [upcoming, setUpcoming] = useState();
	const [loading, setLoading] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);

	const submit = () => {
		onUpdateRecentVersion(immediateUpdate);
		onRequestClose();
	};

	const recentPrice = useSelect((select) =>
		select(coreStore).getEntityRecord('surecart', 'price', price?.id)
	);

	useEffect(() => {
		if (!open || !immediateUpdate) {
			return;
		}
		fetchUpcomingPeriod();
	}, [immediateUpdate, open]);

	const fetchUpcomingPeriod = async () => {
		setLoading(true);
		try {
			const response = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/subscriptions/${subscription?.id}/upcoming_period`,
					{
						update_behavior: immediateUpdate
							? 'immediate'
							: 'scheduled',
						skip_product_group_validation: true,
						refresh_price_version: true,
						expand: ['period.checkout'],
					}
				),
				data: {
					purge_pending_update: false,
				},
			});
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			label={__('Update Price Version', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
			style={{ '--dialog-body-overflow': 'visible' }}
		>
			<ScText
				css={css`
					display: block;
				`}
			>
				{__(
					'Are you sure you want to update this subscription to use the current price? This will change the subscription amount from today onward.',
					'surecart'
				)}
			</ScText>

			<ScText
				css={css`
					display: block;
					margin-top: var(--sc-spacing-small);
					--font-weight: var(--sc-font-weight-bold);
				`}
			>
				<del
					css={css`
						color: var(--sc-color-gray-500);
					`}
				>
					<ScFormatNumber
						type="currency"
						value={
							price?.ad_hoc && subscription?.ad_hoc_amount
								? subscription?.ad_hoc_amount
								: price?.amount
						}
						currency={price?.currency}
					/>
					{intervalString(price, {
						labels: { interval: '/' },
					})}
				</del>
				&nbsp;
				{__('to', 'surecart')}{' '}
				<ScFormatNumber
					type="currency"
					value={
						recentPrice?.ad_hoc && subscription?.ad_hoc_amount
							? subscription?.ad_hoc_amount
							: recentPrice?.amount
					}
					currency={recentPrice?.currency}
				/>
				{intervalString(recentPrice, {
					labels: { interval: '/' },
				})}
			</ScText>

			{immediateUpdate && !!upcoming?.checkout?.amount_due && (
				<ScAlert
					open
					type="warning"
					css={css`
						margin-top: var(--sc-spacing-small);
					`}
				>
					{sprintf(
						__(
							'Changing the subscription price will immediately charge the customer %s.',
							'surecart'
						),
						formatNumber(
							upcoming?.checkout?.amount_due,
							upcoming?.checkout?.currency ?? 'usd'
						)
					)}
				</ScAlert>
			)}

			<div
				css={css`
					display: flex;
					align-items: center;
				`}
				slot="footer"
			>
				<ScButton
					type="primary"
					onClick={() => submit(true)}
					loading={loading}
				>
					{immediateUpdate
						? __('Update Subscription', 'surecart')
						: __('Schedule Update', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
				{!subscription?.finite && (
					<ScSwitch
						checked={immediateUpdate}
						onScChange={(e) => setImmediateUpdate(e.target.checked)}
						css={css`
							margin-left: auto;
						`}
					>
						{__('Update Immediately', 'surecart')}
					</ScSwitch>
				)}
			</div>
		</ScDialog>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
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

export default ({
	price,
	subscription,
	open,
	onUpdateRecentVersion,
	onRequestClose,
}) => {
	const [immediateUpdate, setImmediateUpdate] = useState(false);

	const submit = () => {
		onUpdateRecentVersion(immediateUpdate);
		onRequestClose();
	};

	const recentPrice = useSelect((select) =>
		select(coreStore).getEntityRecord('surecart', 'price', price?.id)
	);

	return (
		<ScDialog
			label={__('Update Recent Price', 'surecart')}
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
					'There is a price change for this subscription since the last renewal. Please choose how you would like to update the subscription price.',
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
				{__('Changed Price: ', 'surecart')}
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

			{!subscription?.finite && (
				<ScText
					css={css`
						display: block;
						margin: var(--sc-spacing-medium) 0;
					`}
				>
					<ScSwitch
						checked={immediateUpdate}
						onScChange={(e) => setImmediateUpdate(e.target.checked)}
					>
						{__('Update Immediately', 'surecart')}
					</ScSwitch>

					<ScAlert
						open={immediateUpdate}
						type="info"
						css={css`
							margin-top: var(--sc-spacing-small);
						`}
					>
						{__(
							'Choosing to update the subscription immediately will update the subscription price immediately. This will affect the next billing cycle.',
							'surecart'
						)}
					</ScAlert>
				</ScText>
			)}

			<div slot="footer">
				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				<ScButton
					type="primary"
					onClick={() => submit(true)}
					slot="footer"
				>
					{immediateUpdate
						? __('Update Subscription', 'surecart')
						: __('Schedule Update', 'surecart')}
				</ScButton>
			</div>
		</ScDialog>
	);
};

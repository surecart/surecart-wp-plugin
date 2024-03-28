/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDialog,
	ScFormatNumber,
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
	const submit = (updateImmediately) => {
		onUpdateRecentVersion(updateImmediately);
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

			<div
				css={css`
					display: flex;
					justify-content: space-between;
				`}
				slot="footer"
			>
				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>

				<div
					css={css`
						display: flex;
						gap: var(--sc-spacing-small);
					`}
				>
					<ScButton
						type="primary"
						onClick={() => submit(true)}
						slot="footer"
					>
						{__('Update Immediately', 'surecart')}
					</ScButton>

					<ScButton
						type="primary"
						onClick={() => submit(false)}
						slot="footer"
					>
						{__('Update on Next Billing', 'surecart')}
					</ScButton>
				</div>
			</div>
		</ScDialog>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScFormatNumber,
	ScIcon,
	ScLineItem,
	ScTag,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import { intervalString } from '../../../util/translations';
import { getHumanDiscount } from '../../../util';
import ModelSelector from '../../../components/ModelSelector';
import { useState } from 'react';
import LineItemLabel from '../../components/LineItemLabel';

export default ({ lineItem, loading, subscription }) => {
	if (!loading && !lineItem) {
		return null;
	}
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [saving, setSaving] = useState(false);
	const coupon = subscription?.discount?.coupon;

	const onSelectCoupon = async (coupon) => {
		setSaving(true);
		try {
			await saveEntityRecord(
				'surecart',
				'subscription',
				{
					id: subscription.id,
					discount: !!coupon
						? {
								coupon,
						  }
						: {},
				},
				{
					throwOnError: true,
				}
			);

			createSuccessNotice(
				!!coupon
					? __('Coupon Added', 'surecart')
					: __('Coupon Removed', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
			(e?.additional_errors || []).forEach((e) => {
				createErrorNotice(
					e?.message || __('Something went wrong', 'surecart'),
					{ type: 'snackbar' }
				);
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<DataTable
				loading={loading}
				title={__('Pricing', 'surecart')}
				columns={{
					product: {
						label: __('Price', 'surecart'),
					},
					quantity: {
						label: __('Qty', 'surecart'),
						width: '75px',
					},
					total: {
						label: (
							<div
								css={css`
									display: flex;
									justify-content: flex-end;
								`}
							>
								{__('Total', 'surecart')}
							</div>
						),
					},
				}}
				items={[
					{
						product: lineItem && (
							<div>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 1em;
									`}
								>
									<div>
										<div>
											{lineItem?.price?.product?.name}
										</div>
										<LineItemLabel lineItem={lineItem}>
											<div>
												<ScFormatNumber
													type="currency"
													value={
														lineItem?.ad_hoc_amount ||
														lineItem?.subtotal_amount
													}
													currency={
														lineItem?.price
															?.currency
													}
												/>
												{intervalString(
													lineItem?.price,
													{
														labels: {
															interval: '/',
														},
													}
												)}
											</div>
										</LineItemLabel>
									</div>
									{!subscription?.finite && !subscription?.price_readonly && (
										<ScButton
											size="small"
											href={addQueryArgs('admin.php', {
												page: 'sc-subscriptions',
												action: 'edit',
												id: subscription?.id,
											})}
										>
											{__('Change', 'surecart')}
										</ScButton>
									)}
								</div>
							</div>
						),
						quantity: lineItem?.quantity,
						total: (
							<div
								css={css`
									display: flex;
									justify-content: flex-end;
									flex-direction: column;
								`}
							>
								<div>
									<ScFormatNumber
										type="currency"
										value={lineItem?.subtotal_amount}
										currency={lineItem?.price?.currency}
									/>{' '}
									{intervalString(lineItem?.price, {
										labels: { interval: '/' },
									})}
								</div>
								{lineItem?.price?.setup_fee_enabled && (
									<div>
										<span>
											{lineItem?.price?.setup_fee_name ||
												(lineItem?.price
													?.setup_fee_amount < 0
													? __('Discount', 'surecart')
													: __(
															'Setup Fee',
															'surecart'
													  ))}
										</span>
										{': '}
										<ScFormatNumber
											type="currency"
											value={
												lineItem?.price
													?.setup_fee_amount
											}
											currency={lineItem?.price?.currency}
										/>
									</div>
								)}
							</div>
						),
					},
					...(!!coupon?.id
						? [
								{
									product: (
										<ScTag
											type="default"
											clearable
											onClick={() => onSelectCoupon()}
										>
											{coupon?.name}
										</ScTag>
									),
									total: (
										<>
											(
											{getHumanDiscount(
												coupon,
												coupon?.currency
											)}
											)
										</>
									),
								},
						  ]
						: []),
				]}
				footer={
					!coupon &&
					!loading && (
						<ModelSelector
							style={{ width: '50%' }}
							name="coupon"
							requestQuery={{
								archived: false,
							}}
							onSelect={onSelectCoupon}
						>
							<ScButton slot="trigger">
								<ScIcon name="plus" slot="prefix" />
								{__('Add Coupon', 'surecart')}
							</ScButton>
						</ModelSelector>
					)
				}
			/>
			{saving && (
				<ScBlockUi
					spinner
					style={{ '--sc-block-ui-opacity': '0.5' }}
				></ScBlockUi>
			)}
		</div>
	);
};

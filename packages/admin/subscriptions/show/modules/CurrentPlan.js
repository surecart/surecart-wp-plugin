/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import { intervalString } from '../../../util/translations';
import LineItems from './LineItems';
import { css, jsx } from '@emotion/core';
import { ScButton, ScFormatNumber } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ subscriptionId, lineItem, loading, subscription }) => {
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
										{lineItem?.price?.product?.name}
										<div style={{ opacity: 0.5 }}>
											<ScFormatNumber
												type="currency"
												value={
													lineItem?.ad_hoc_amount ||
													lineItem?.total_amount
												}
												currency={
													lineItem?.price?.currency
												}
											/>
											{intervalString(lineItem?.price, {
												labels: { interval: '/' },
											})}
										</div>
									</div>
									{!subscription?.finite && (
										<ScButton
											size="small"
											href={addQueryArgs('admin.php', {
												page: 'sc-subscriptions',
												action: 'edit',
												id: subscriptionId,
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
								`}
							>
								<div>
									<ScFormatNumber
										type="currency"
										value={lineItem?.total_amount}
										currency={lineItem?.price?.currency}
									/>{' '}
									{intervalString(lineItem?.price, {
										labels: { interval: '/' },
									})}
								</div>
							</div>
						),
					},
				]}
			/>
		</div>
	);
};

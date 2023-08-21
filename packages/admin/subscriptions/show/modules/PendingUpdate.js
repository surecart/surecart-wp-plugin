/** @jsx jsx */
import DataTable from '../../../components/DataTable';
import { intervalString } from '../../../util/translations';
import { css, jsx } from '@emotion/core';
import { ScFormatDate } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import VariantLabel from '../../components/VariantLabel';

export default ({ subscription }) => {
	const { pending_update } = subscription || {};
	const [pendingVariant, setPendingVariant] = useState(null);

	const { price, hasLoadedPrice } = useSelect(
		(select) => {
			if (!pending_update) return {};
			const queryArgs = [
				'surecart',
				'price',
				pending_update?.price?.id ||
					pending_update?.price ||
					subscription?.price?.id ||
					subscription?.price,
				{
					expand: ['product'],
				},
			];
			return {
				price: select(coreStore).getEntityRecord(...queryArgs),
				hasLoadedPrice: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[pending_update]
	);

	useEffect(() => {
		fetchPendingVariant();
	}, [pending_update?.variant]);

	const fetchPendingVariant = async () => {
		if (!pending_update?.variant) return;
		const pendingVariantData = await apiFetch({
			path: addQueryArgs(
				`surecart/v1/variants/${pending_update?.variant}`,
				{}
			),
		});

		setPendingVariant(pendingVariantData);
	};

	return (
		<DataTable
			loading={!hasLoadedPrice}
			title={__('Pending Update', 'surecart')}
			columns={{
				product: {
					label: __('Product', 'surecart'),
				},
				quantity: {
					label: __('Qty', 'surecart'),
					width: '75px',
				},
				schedule: {
					label: (
						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							{__('Scheduled', 'surecart')}
						</div>
					),
				},
			}}
			items={[
				{
					product: (
						<div>
							{price?.product?.name}

							{pendingVariant && (
								<VariantLabel
									variantOptions={[
										pendingVariant?.option_1,
										pendingVariant?.option_2,
										pendingVariant?.option_3,
									]}
								/>
							)}
							<div
								css={css`
									opacity: 0.5;
								`}
							>
								<sc-format-number
									type="currency"
									value={
										pending_update?.ad_hoc_amount ||
										price?.amount
									}
									currency={price?.currency}
								/>
								{intervalString(price, {
									labels: { interval: '/' },
								})}
							</div>
						</div>
					),
					quantity:
						pending_update?.quantity || subscription?.quantity,
					schedule: (
						<div>
							{sprintf(__('Scheduled', 'surecart'))}
							<div
								css={css`
									opacity: 0.5;
								`}
							>
								<ScFormatDate
									date={subscription?.current_period_end_at}
									type="timestamp"
									month="long"
									day="numeric"
									year="numeric"
								></ScFormatDate>
							</div>
						</div>
					),
				},
			]}
		/>
	);
};

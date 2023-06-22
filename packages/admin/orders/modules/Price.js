/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import {
	ScButton,
	ScCard,
	ScFlex,
	ScSkeleton,
	ScText,
	ScStackedList,
	ScFormatNumber
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import ModelRow from './ModelRow';

export default ({ price, setPrices, prices }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	
	const onRemove = () => {
		
		let finalPrices = [
			...prices
		];

		finalPrices = finalPrices.filter(function(productItem) {
			return productItem?.id !== price?.id;
		});

		setPrices(finalPrices);

		createSuccessNotice(__('Product removed.', 'surecart'), {
			type: 'snackbar',
		});
	};

	return (
		<ScCard noPadding>
			<ScStackedList>
				<ModelRow
					icon={'image'}
					imageUrl={price?.product?.image_url}
					suffix={
						<div>
							<ScButton
								size="small"
								onClick={onRemove}
							>
								{__('Remove', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<div>
						<strong>{price?.product?.name}</strong>
					</div>
					<ScFormatNumber
						type="currency"
						currency={price?.currency || 'usd'}
						value={price?.amount}
					/>
					{intervalString(price)}
				</ModelRow>
			</ScStackedList>
		</ScCard>
	);
};

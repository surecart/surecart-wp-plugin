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
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';

export default ({ product }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const savingProduct = useSelect((select) =>
		select(coreStore).isSavingEntityRecord(
			'surecart',
			'product',
			product?.id
		)
	);

	const onRemove = async () => {
		await saveEntityRecord('surecart', 'product', {
			id: product?.id,
			product_group: null,
		});
		await invalidateResolutionForStore();
		createSuccessNotice(__('Product removed.', 'surecart'), {
			type: 'snackbar',
		});
	};

	return (
		<ScCard>
			<ScFlex>
				<div>
					<ScText
						style={{
							'--font-size': 'var(--sc-font-size-large)',
						}}
					>
						{product?.name}
					</ScText>
					{(product?.prices?.data || []).map((price) => {
						if (!price.archived) {
							return (
								<div
									css={css`
										opacity: 0.5;
									`}
									key={price?.id}
								>
									<sc-format-number
										type="currency"
										value={price?.amount}
										currency={price?.currency}
									/>
									{intervalString(price, {
										labels: { interval: '/' },
									})}
								</div>
							);
						}
					})}
				</div>
				<div>
					<ScButton
						size="small"
						onClick={onRemove}
						busy={savingProduct}
					>
						{__('Remove', 'surecart')}
					</ScButton>
				</div>
			</ScFlex>
		</ScCard>
	);
};

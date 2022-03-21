/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { useDispatch, useSelect } from '@wordpress/data';
import { store } from '../../store/data';
import { translateInterval } from '../../util/translations';
import { CeButton } from '@surecart/components-react';

export default ({ product }) => {
	const prices = useSelect((select) =>
		select(store)
			.selectCollection('price')
			.filter((price) => price.product === product.id)
	);
	const { updateModel } = useDispatch(store);

	const onRemove = () => {
		updateModel('product', product.id, { product_group: null });
	};

	return (
		<ce-card>
			<ce-flex>
				<div>
					<ce-text
						style={{
							'--font-size': 'var(--ce-font-size-large)',
						}}
					>
						{product?.name}
					</ce-text>
					{(prices || []).map((price) => {
						return (
							<div
								css={css`
									opacity: 0.5;
								`}
								key={price?.id}
							>
								<ce-format-number
									type="currency"
									value={price?.amount}
									currency={price?.currency}
								/>
								{translateInterval(
									price?.recurring_interval_count,
									price?.recurring_interval,
									' /',
									''
								)}
							</div>
						);
					})}
				</div>
				<div>
					<CeButton size="small" onClick={onRemove}>
						{__('Remove', 'surecart')}
					</CeButton>
				</div>
			</ce-flex>
		</ce-card>
	);
};

/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { useDispatch, useSelect } from '@wordpress/data';
import { store } from '../../store/data';
import { intervalString } from '../../util/translations';
import { ScButton } from '@surecart/components-react';

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
		<sc-card>
			<sc-flex>
				<div>
					<sc-text
						style={{
							'--font-size': 'var(--sc-font-size-large)',
						}}
					>
						{product?.name}
					</sc-text>
					{(prices || []).map((price) => {
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
					})}
				</div>
				<div>
					<ScButton size="small" onClick={onRemove}>
						{__('Remove', 'surecart')}
					</ScButton>
				</div>
			</sc-flex>
		</sc-card>
	);
};

/** @jsx jsx */
import { ScChoice, ScChoices } from '@surecart/components-react';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import useEntities from '../../../mixins/useEntities';
import { store } from '../../../store/data';
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';

export default ({ subscription, updateSubscription, loading }) => {
	const { fetchPaymentmethods, payment_methods } =
		useEntities('payment_method');

	useEffect(() => {
		if (subscription?.customer) {
			fetchPaymentmethods({
				query: {
					customer_ids: [subscription?.customer],
					context: 'edit',
					expand: ['card'],
				},
			});
		}
	}, [subscription?.customer]);

	return (
		<Box title={__('Payment Method', 'surecart')} loading={loading}>
			<ScChoices label={__('Choose a payment method')}>
				<div>
					{(payment_methods || []).map((method) => {
						const card = select(store).selectRelation(
							'payment_method',
							method?.id,
							'card'
						);
						return (
							<ScChoice
								checked={
									method?.id === subscription?.payment_method
								}
								value={method?.id}
								onScChange={(e) => {
									if (!e.target.checked) return;
									updateSubscription({
										payment_method: method?.id,
									});
								}}
							>
								<div
									css={css`
										display: flex;
										gap: 1em;
									`}
								>
									<sc-cc-logo
										style={{ fontSize: '36px' }}
										brand={card?.brand}
									></sc-cc-logo>
									<div>**** {card?.last4}</div>
									<div>
										{card?.exp_month}/{card?.exp_year}
									</div>
								</div>
							</ScChoice>
						);
					})}
				</div>
			</ScChoices>
		</Box>
	);
};

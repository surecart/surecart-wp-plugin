/** @jsx jsx */
import { CeChoice, CeChoices } from '@checkout-engine/components-react';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import useEntities from '../../../mixins/useEntities';
import { store } from '../../../store/data';
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';

export default ({ subscription, updateSubscription, loading }) => {
	const { fetchEntities, data } = useEntities('payment_method');

	useEffect(() => {
		if (subscription?.customer) {
			fetchEntities({
				query: {
					customer_ids: [subscription?.customer],
					context: 'edit',
					expand: ['card'],
				},
			});
		}
	}, [subscription?.customer]);

	return (
		<Box title={__('Payment Method', 'checkout_engine')} loading={loading}>
			<CeChoices label={__('Choose a payment method')}>
				<div>
					{(data || []).map((method) => {
						const card = select(store).selectRelation(
							'payment_method',
							method?.id,
							'card'
						);
						return (
							<CeChoice
								checked={
									method?.id === subscription?.payment_method
								}
								value={method?.id}
								onCeChange={(e) => {
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
									<ce-cc-logo
										style={{ fontSize: '36px' }}
										brand={card?.brand}
									></ce-cc-logo>
									<div>**** {card?.last4}</div>
									<div>
										{card?.exp_month}/{card?.exp_year}
									</div>
								</div>
							</CeChoice>
						);
					})}
				</div>
			</CeChoices>
		</Box>
	);
};

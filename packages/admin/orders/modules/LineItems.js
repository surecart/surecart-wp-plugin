/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { CardDivider } from '@wordpress/components';
import Box from '../../ui/Box';
import { translateInterval } from '../../util/translations';
import useLineItemData from '../hooks/useLineItemData';
import { CeButton } from '@checkout-engine/components-react';
import useOrderData from '../hooks/useOrderData';
import Definition from '../../ui/Definition';

export default () => {
	const { line_items } = useLineItemData();
	const { order, loading } = useOrderData();

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box title={ __( 'Order Details', 'checkout_engine' ) }>
			{ loading ? (
				renderLoading()
			) : (
				<Fragment>
					{ ( line_items || [] ).map( ( item, index ) => {
						return (
							<ce-product-line-item
								key={ item.id }
								imageUrl={
									item?.price?.metadata?.wp_attachment_src
								}
								name={ `${ item?.price?.product?.name } \u2013 ${ item?.price?.name }` }
								editable={ false }
								removable={ false }
								quantity={ item.quantity }
								amount={
									item.ad_hoc_amount !== null
										? item.ad_hoc_amount
										: item.price.amount
								}
								currency={ item?.price?.currency }
								trialDurationDays={
									item?.price?.trial_duration_days
								}
								interval={ translateInterval(
									item?.price?.recurring_interval_count,
									item?.price?.recurring_interval
								) }
							></ce-product-line-item>
						);
					} ) }

					<hr />

					<Definition title={ __( 'Subtotal', 'checkout_session' ) }>
						<ce-format-number
							style={ {
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							} }
							type="currency"
							currency={ order?.currency }
							value={ order?.subtotal_amount }
						></ce-format-number>
					</Definition>
					<Definition title={ __( 'Discounts', 'checkout_session' ) }>
						<ce-format-number
							style={ {
								'font-weight': 'var(--ce-font-weight-semibold)',
								color: 'var(--ce-color-gray-800)',
							} }
							type="currency"
							currency={ order?.currency }
							value={ order?.discount_amount }
						></ce-format-number>
					</Definition>

					<hr />

					<Definition title={ __( 'Total', 'checkout_session' ) }>
						<div
							css={ css`
								display: flex;
								align-items: center;
								gap: 1em;
							` }
						>
							<div
								css={ css`
									text-transform: uppercase;
								` }
							>
								{ order?.currency }
							</div>
							<ce-format-number
								style={ {
									fontSize: 'var(--ce-font-size-x-large)',
									fontWeight:
										'var(--ce-font-weight-semibold)',
									color: 'var(--ce-color-gray-800)',
								} }
								type="currency"
								currency={ order?.currency }
								value={ order?.total_amount }
							></ce-format-number>
						</div>
					</Definition>
				</Fragment>
			) }
		</Box>
	);
};

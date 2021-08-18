/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { format } = wp.date;
const { Fragment } = wp.element;

import Box from '../ui/Box';
import Definition from '../ui/Definition';

export default ( { promotion, loading } ) => {
	const coupon = promotion?.coupon;

	const promotionTag = () => {
		if ( promotion.active ) {
			return (
				<ce-tag type="success">
					{ __( 'Active', 'checkout_engine' ) }
				</ce-tag>
			);
		}

		if ( ! promotion?.id ) {
			return <ce-tag>{ __( 'Draft', 'checkout_engine' ) }</ce-tag>;
		}

		if ( ! promotion.active ) {
			return <ce-tag>{ __( 'Disabled', 'checkout_engine' ) }</ce-tag>;
		}
	};

	return (
		<Box
			loading={ loading }
			title={
				<div
					css={ css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					` }
				>
					{ __( 'Summary', 'checkout_engine' ) }{ ' ' }
				</div>
			}
			css={ css`
				font-size: 14px;
			` }
		>
			<Fragment>
				<Definition
					title={
						promotion?.code || __( 'Coupon', 'checkout_engine' )
					}
				>
					<Fragment>{ promotionTag() }</Fragment>
				</Definition>

				<Definition title={ __( 'Discount', 'checkout_engine' ) }>
					25% off
				</Definition>
				<Definition title={ __( 'Uses', 'checkout_engine' ) }>
					{ coupon?.times_redeemed || 0 } /
					{ !! coupon?.max_redemptions ? (
						coupon?.max_redemptions
					) : (
						<span>&infin;</span>
					) }
				</Definition>
				<Definition title={ __( 'Active', 'checkout_engine' ) }>
					{ !! coupon?.updated_at
						? format(
								'F j, Y',
								new Date( coupon.updated_at * 1000 )
						  )
						: '' }
				</Definition>
				<Definition title={ __( 'Created', 'checkout_engine' ) }>
					{ !! coupon?.created_at
						? format(
								'F j, Y',
								new Date( coupon.created_at * 1000 )
						  )
						: '' }
				</Definition>
			</Fragment>
		</Box>
	);
};

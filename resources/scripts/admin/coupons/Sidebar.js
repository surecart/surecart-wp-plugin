/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __, sprintf } = wp.i18n;
const { format } = wp.date;
const { Fragment } = wp.element;

import Box from '../ui/Box';
import Definition from '../ui/Definition';

export default ( { promotion, coupon, loading } ) => {
	const promotionTag = () => {
		if ( ! promotion?.id ) {
			return <ce-tag>{ __( 'Draft', 'checkout_engine' ) }</ce-tag>;
		}

		if ( promotion.archived ) {
			return <ce-tag>{ __( 'Archived', 'checkout_engine' ) }</ce-tag>;
		}

		return (
			<ce-tag type="success">
				{ __( 'Active', 'checkout_engine' ) }
			</ce-tag>
		);
	};

	const formattedDiscount = () => {
		if ( coupon?.percent_off ) {
			return sprintf(
				__( '%1s%% off', 'checkout_engine' ),
				coupon?.percent_off
			);
		}
		if ( coupon?.amount_off ) {
			return (
				<ce-format-number
					type="currency"
					currency={ coupon?.currency }
					value={ coupon?.amount_off }
				></ce-format-number>
			);
		}
	};

	const renderDuration = () => {
		if ( coupon?.duration === 'once' ) {
			return __( 'Once', 'checkout_engine' );
		}
		if ( coupon?.duration === 'repeating' && coupon?.duration_in_months ) {
			return sprintf(
				__( '%d months', 'checkout_engine' ),
				coupon?.duration_in_months
			);
		}
		return __( 'Forever', 'checkout_engine' );
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

				{ formattedDiscount() && (
					<Definition title={ __( 'Discount', 'checkout_engine' ) }>
						{ formattedDiscount() }
					</Definition>
				) }

				<Definition title={ __( 'Uses', 'checkout_engine' ) }>
					{ promotion?.times_redeemed || 0 } /{ ' ' }
					{ !! promotion?.max_redemptions ? (
						promotion?.max_redemptions
					) : (
						<span>&infin;</span>
					) }
				</Definition>

				<Definition title={ __( 'Duration', 'checkout_engine' ) }>
					{ renderDuration() }
				</Definition>

				{ !! promotion?.redeem_by && (
					<Definition title={ __( 'Redeem By', 'checkout_engine' ) }>
						{ format( 'F j, Y', new Date( promotion.redeem_by ) ) }
					</Definition>
				) }

				{ !! promotion?.id && <hr /> }

				{ !! promotion?.updated_at && (
					<Definition
						title={ __( 'Last Updated', 'checkout_engine' ) }
					>
						{ format(
							'F j, Y',
							new Date( promotion.updated_at * 1000 )
						) }
					</Definition>
				) }

				{ !! promotion?.created_at && (
					<Definition title={ __( 'Created', 'checkout_engine' ) }>
						{ format(
							'F j, Y',
							new Date( promotion.created_at * 1000 )
						) }
					</Definition>
				) }
			</Fragment>
		</Box>
	);
};

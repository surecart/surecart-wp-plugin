/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf, _n } from '@wordpress/i18n';
import { format } from '@wordpress/date';
import { Fragment } from '@wordpress/element';

import { CeButton } from '@checkout-engine/components-react';

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import useCouponData from './hooks/useCouponData';
import usePromotionData from './hooks/usePromotionData';
import ArchiveToggle from './components/ArchiveToggle';

export default () => {
	const { coupon, loading: loadingCoupons, updateCoupon } = useCouponData();
	const { activePromotions, loading: loadingPromotions } = usePromotionData();
	const loading = loadingCoupons && loadingPromotions;

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
		<Fragment>
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
						title={ _n(
							'Code',
							'Codes',
							activePromotions?.length,
							'checkout_engine'
						) }
					>
						<div
							css={ css`
								text-align: right;
								display: grid;
								gap: 0.5em;
							` }
						>
							{ ( activePromotions || [] ).map( ( promotion ) => {
								if ( ! promotion?.code ) return null;
								return (
									<div>
										<code>{ promotion?.code }</code>
									</div>
								);
							} ) }
						</div>
					</Definition>

					{ /* <Definition title={ __( 'Active', 'checkout_engine' ) }>
						<ArchiveToggle />
					</Definition> */ }

					{ formattedDiscount() && (
						<Definition
							title={ __( 'Discount', 'checkout_engine' ) }
						>
							{ formattedDiscount() }
						</Definition>
					) }

					<Definition title={ __( 'Uses', 'checkout_engine' ) }>
						{ coupon?.times_redeemed || 0 } /{ ' ' }
						{ !! coupon?.max_redemptions ? (
							coupon?.max_redemptions
						) : (
							<span>&infin;</span>
						) }
					</Definition>

					<Definition title={ __( 'Duration', 'checkout_engine' ) }>
						{ renderDuration() }
					</Definition>

					{ !! coupon?.redeem_by && (
						<Definition
							title={ __( 'Redeem By', 'checkout_engine' ) }
						>
							{ format( 'F j, Y', new Date( coupon.redeem_by ) ) }
						</Definition>
					) }

					{ !! coupon?.id && <hr /> }

					{ !! coupon?.updated_at && (
						<Definition
							title={ __( 'Last Updated', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( coupon.updated_at * 1000 )
							) }
						</Definition>
					) }

					{ !! coupon?.created_at && (
						<Definition
							title={ __( 'Created', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( coupon.created_at * 1000 )
							) }
						</Definition>
					) }
					{ !! coupon?.archived_at && (
						<Definition
							css={ css`
								margin-bottom: 1em;
							` }
							title={ __( 'Archived On', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( product?.archived_at * 1000 )
							) }
						</Definition>
					) }
				</Fragment>
			</Box>
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
						{ __( 'Automations', 'checkout_engine' ) }
					</div>
				}
				css={ css`
					font-size: 14px;
				` }
				footer={
					! loading && (
						<CeButton>
							<svg
								slot="prefix"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>

							{ __( 'Add Automation', 'checkout_engine' ) }
						</CeButton>
					)
				}
			>
				{ __(
					'To get started, add an automation.',
					'checkout_engine'
				) }
			</Box>
		</Fragment>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { format } = wp.date;
const { Fragment } = wp.element;

import Box from '../ui/Box';
import Definition from '../ui/Definition';

export default ( { coupon, loading } ) => {
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
				<Definition title={ 'TEST' }>
					<Fragment>
						{ !! coupon?.id && !! coupon?.expired && (
							<ce-tag type="danger">
								{ __( 'Expired', 'checkout_engine' ) }
							</ce-tag>
						) }
						{ /* { !! coupon?.id && ! coupon?.expired && ( */ }
						<ce-tag type="success">
							{ __( 'Active', 'checkout_engine' ) }
						</ce-tag>
						{ /* ) } */ }
					</Fragment>
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
					{ !! coupon.updated_at
						? format(
								'F j, Y',
								new Date( coupon.updated_at * 1000 )
						  )
						: '' }
				</Definition>
				<Definition title={ __( 'Created', 'checkout_engine' ) }>
					{ !! coupon.created_at
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

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { format } = wp.date;
const { withSelect, dispatch } = wp.data;
const { useEffect, Fragment } = wp.element;
const { SnackbarList, Icon } = wp.components;
const { getQueryArg } = wp.url;

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Limits from './modules/Limits';
import Box from '../ui/Box';
import Definition from '../ui/Definition';
import Sidebar from './Sidebar';

export default withSelect( ( select ) => {
	const id = getQueryArg( window.location, 'id' );
	const { isResolving } = select( 'checkout-engine/coupon' );
	return {
		coupon: select( 'checkout-engine/coupon' ).getCoupon( id ),
		loading: isResolving( 'checkout-engine/coupon', 'getCoupon', [ id ] ),
		notices: select( 'checkout-engine/notices' ).notices(),
		updateCoupon: ( data ) =>
			dispatch( 'checkout-engine/coupon' ).updateCoupon( data ),
		removeNotice: ( id ) =>
			dispatch( 'checkout-engine/notices' ).removeNotice( id ),
		addNotice: ( notice ) =>
			dispatch( 'checkout-engine/notices' ).addNotice( notice ),
	};
} )( ( props ) => {
	const { coupon, loading, updateCoupon, notices, removeNotice } = props;

	return (
		<Template
			title={
				<>
					<Icon icon="tag" style={ { opacity: '0.25' } } />{ ' ' }
					{ coupon?.name
						? sprintf(
								__( 'Edit %s', 'checkout_engine' ),
								coupon.name
						  )
						: __( 'Add Coupon', 'checkout_engine' ) }
				</>
			}
			button={
				<SaveButton>
					{ __( 'Save Coupon', 'checkout_engine' ) }
				</SaveButton>
			}
			notices={ notices }
			sidebar={ <Sidebar coupon={ coupon } /> }
			removeNotice={ removeNotice }
		>
			<Fragment>
				<Codes coupon={ coupon } updateCoupon={ updateCoupon } />
				<Types coupon={ coupon } updateCoupon={ updateCoupon } />
				<Limits coupon={ coupon } updateCoupon={ updateCoupon } />
			</Fragment>
		</Template>
	);

	return (
		<div
			css={ css`
				font-size: 15px;
				margin-right: 20px;
				.components-snackbar.is-snackbar-error {
					background: #cc1818;
				}
			` }
		>
			<div
				css={ css`
					background: #fff;
					padding: 20px;
					margin-left: -20px;
					margin-right: -20px;
					margin-bottom: 30px;
					position: sticky;
					display: flex;
					align-items: center;
					justify-content: space-between;
					top: 32px;
					z-index: 99;

					@media screen and ( max-width: 782px ) {
						top: 46px;
					}
				` }
			>
				{ loading ? (
					<ce-skeleton style={ { width: '150px' } }></ce-skeleton>
				) : (
					<h1
						css={ css`
							margin: 0;
							font-size: 1.3em;
							font-weight: normal;
						` }
					>
						<Icon icon="tag" style={ { opacity: '0.25' } } />{ ' ' }
						{ coupon?.name
							? sprintf(
									__( 'Edit %s', 'checkout_engine' ),
									coupon.name
							  )
							: __( 'Add Coupon', 'checkout_engine' ) }
					</h1>
				) }
				<SaveButton />
			</div>

			<div
				css={ css`
					padding: 0 5px;
					display: grid;
					margin: auto;
					max-width: 960px;
					grid-template-columns: 1fr 320px;
					grid-gap: 2em;
					grid-template-areas: 'nav    sidebar';
				` }
			>
				{ loading ? (
					<ce-skeleton></ce-skeleton>
				) : (
					<div
						css={ css`
							> * ~ * {
								margin-top: 1em;
							}
						` }
					>
						<Codes
							coupon={ coupon }
							updateCoupon={ updateCoupon }
						/>
						<Types
							coupon={ coupon }
							updateCoupon={ updateCoupon }
						/>
						<Limits
							coupon={ coupon }
							updateCoupon={ updateCoupon }
						/>
					</div>
				) }
				<div>
					<Box
						title={ __( 'Summary', 'checkout_engine' ) }
						css={ css`
							font-size: 14px;
						` }
					>
						<Definition title={ __( 'Status', 'checkout_engine' ) }>
							{ !! coupon?.expired ? (
								<ce-tag type="danger">
									{ __( 'Expired', 'checkout_engine' ) }
								</ce-tag>
							) : (
								<ce-tag type="success">
									{ __( 'Active', 'checkout_engine' ) }
								</ce-tag>
							) }
						</Definition>
						<Definition title={ __( 'Uses', 'checkout_engine' ) }>
							{ coupon?.times_redeemed || 0 } /
							{ !! coupon?.max_redemptions ? (
								coupon?.max_redemptions
							) : (
								<span>&infin;</span>
							) }
						</Definition>
						<hr />
						<Definition
							title={ __( 'Created', 'checkout_engine' ) }
						>
							{ !! coupon.created_at
								? format(
										'F j, Y',
										new Date( coupon.created_at * 1000 )
								  )
								: '' }
						</Definition>
						<Definition
							title={ __( 'Updated', 'checkout_engine' ) }
						>
							{ !! coupon.updated_at
								? format(
										'F j, Y',
										new Date( coupon.updated_at * 1000 )
								  )
								: '' }
						</Definition>
					</Box>
				</div>
			</div>

			<SnackbarList
				css={ css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;
				` }
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</div>
	);
} );

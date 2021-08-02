/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { withSelect, dispatch } = wp.data;
const { useState } = wp.element;
const {
	DateTimePicker,
	CheckboxControl,
	Button,
	TextControl,
	SelectControl,
	BaseControl,
	Card,
	Icon,
	RadioControl,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	FlexItem,
	FlexBlock,
} = wp.components;
const { getQueryArg } = wp.url;

import SaveButton from './components/SaveButton';

export default withSelect( ( select ) => {
	const id = getQueryArg( window.location, 'id' );
	const { isResolving } = select( 'checkout-engine/coupon' );
	return {
		coupon: select( 'checkout-engine/coupon' ).getCoupon( id ),
		loading: isResolving( 'checkout-engine/coupon', 'getCoupon', [ id ] ),
		updateCoupon: ( data ) => {
			dispatch( 'checkout-engine/coupon' ).updateCoupon( data );
		},
	};
} )( ( props ) => {
	const { coupon, loading, updateCoupon } = props;

	const [ type, setType ] = useState( 'percentage' );

	const controlCSS = css`
		margin-bottom: 20px;
	`;

	return (
		<div
			className="presto-settings"
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
					grid-template-columns: 1fr 380px;
					grid-gap: 2em;
					grid-template-areas: 'nav    sidebar';
				` }
			>
				{ loading ? (
					<ce-skeleton></ce-skeleton>
				) : (
					<div>
						<BaseControl css={ controlCSS }>
							<TextControl
								label={ __( 'Coupon Name', 'checkout_engine' ) }
								value={ coupon?.name }
								onChange={ ( name ) =>
									updateCoupon( { name } )
								}
							/>
						</BaseControl>
						<BaseControl css={ controlCSS }>
							<RadioControl
								label={ __( 'Type', 'checkout_engine' ) }
								selected={ type }
								options={ [
									{
										label: __(
											'Percentage Discount',
											'checkout_engine'
										),
										value: 'percentage',
									},
									{
										label: __(
											'Fixed Discount',
											'checkout_engine'
										),
										value: 'fixed',
									},
								] }
								onChange={ ( val ) => {
									setType( val );
								} }
							/>
						</BaseControl>
						<BaseControl css={ controlCSS }>
							{ type === 'percentage' ? (
								<TextControl
									label={ __(
										'Percent Off',
										'checkout-engine'
									) }
									value={ coupon?.percent_off }
									onChange={ ( percent_off ) =>
										updateCoupon( { percent_off } )
									}
								/>
							) : (
								<TextControl
									label={ __(
										'Amount Off',
										'checkout-engine'
									) }
									value={ coupon?.amount_off }
									onChange={ ( amount_off ) =>
										updateCoupon( { amount_off } )
									}
								/>
							) }
						</BaseControl>

						<BaseControl css={ controlCSS }>
							<SelectControl
								label={ __( 'Duration', 'checkout_engine' ) }
								value={ coupon?.duration }
								onChange={ ( duration ) =>
									updateCoupon( { duration } )
								}
								options={ [
									{
										label: __(
											'Forever',
											'checkout_engine'
										),
										value: 'forever',
									},
									{
										label: __( 'Once', 'checkout_engine' ),
										value: 'once',
									},
									{
										label: __(
											'Multiple Months',
											'checkout_engine'
										),
										value: 'repeating',
									},
								] }
							/>
						</BaseControl>

						{ coupon?.duration === 'repeating' && (
							<BaseControl css={ controlCSS }>
								<TextControl
									label={ __(
										'Number of Months',
										'checkout_engine'
									) }
									value={ coupon?.duration_in_months || 1 }
									type="number"
								/>
							</BaseControl>
						) }

						<BaseControl css={ controlCSS }>
							<BaseControl.VisualLabel
								css={ css`
									display: block;
									margin-bottom: 10px;
								` }
							>
								{ __( 'Redemption Limits', 'checkout_engine' ) }
							</BaseControl.VisualLabel>
							<BaseControl css={ controlCSS }>
								<CheckboxControl
									label={ __(
										'Limit the date range when customers can redeem this coupon.'
									) }
									checked={ coupon?.redeem_by }
									onChange={ ( val ) => {
										updateCoupon( {
											redeem_by: val ? new Date() : null,
										} );
									} }
								/>
								{ !! coupon?.redeem_by && (
									<div
										css={ css`
											max-width: 288px;
										` }
									>
										<DateTimePicker
											currentDate={ coupon?.redeem_by }
											onChange={ ( redeem_by ) =>
												updateCoupon( { redeem_by } )
											}
										/>
									</div>
								) }
								<CheckboxControl
									label={ __(
										'Limit the total number of times this coupon can be redeemed'
									) }
									checked={ false }
									checked={ coupon?.max_redemptions }
									onChange={ ( val ) => {
										updateCoupon( {
											max_redemptions: val ? 1 : null,
										} );
									} }
								/>
							</BaseControl>
							{ !! coupon?.max_redemptions && (
								<BaseControl css={ controlCSS }>
									<TextControl
										label={ __(
											'Number of Months',
											'checkout_engine'
										) }
										value={ coupon?.max_redemptions || 1 }
										type="number"
									/>
								</BaseControl>
							) }
						</BaseControl>

						<BaseControl css={ controlCSS }>
							<BaseControl.VisualLabel>
								Promo Codes
							</BaseControl.VisualLabel>
							<div
								css={ css`
									margin-top: 15px;
								` }
							>
								<Button isPrimary>Add Promo Code</Button>
							</div>
						</BaseControl>
					</div>
				) }
				<div>
					<Card size="small">
						<CardHeader>
							<h4
								css={ css`
									margin: 0;
								` }
							>
								Coupon
							</h4>
						</CardHeader>
						<CardBody>
							<Flex>
								<FlexItem style={ { marginRight: '20px' } }>
									Label
								</FlexItem>
								<FlexBlock>Something</FlexBlock>
							</Flex>
						</CardBody>
						<CardFooter size="small">
							<SaveButton />
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
} );

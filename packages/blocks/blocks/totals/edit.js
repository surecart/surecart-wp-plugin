/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { CeCouponForm } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	return (
		<ce-order-summary>
			<ce-divider></ce-divider>
			<ce-line-items></ce-line-items>
			<ce-divider></ce-divider>
			<ce-line-item-total class="ce-subtotal" total="subtotal">
				<span slot="description">
					{ __( 'Subtotal', 'checkout_engine' ) }
				</span>
			</ce-line-item-total>
			<CeCouponForm label={ __( 'Add Coupon Code' ) }>
				{ __( 'Apply Coupon', 'checkout_engine' ) }
			</CeCouponForm>
			<ce-divider></ce-divider>
			<ce-line-item-total
				class="ce-line-item-total"
				total="total"
				size="large"
				show-currency
			>
				<span slot="title">{ __( 'Total', 'checkout_engine' ) }</span>

				<span slot="subscription-title">
					{ __( 'Total Due Today', 'checkout_engine' ) }
				</span>
			</ce-line-item-total>
		</ce-order-summary>
	);
};

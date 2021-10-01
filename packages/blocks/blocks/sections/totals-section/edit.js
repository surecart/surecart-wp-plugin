/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeCouponForm, CeFormSection } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { label, description } = attributes;

	return (
		<CeFormSection>
			<RichText
				slot="label"
				aria-label={ __( 'Label' ) }
				placeholder={ __( 'Add a title' ) }
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
				withoutInteractiveFormatting
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>
			<RichText
				slot="description"
				aria-label={ __( 'Description' ) }
				placeholder={ __( 'Add a description' ) }
				value={ description }
				onChange={ ( value ) =>
					setAttributes( { description: value } )
				}
				withoutInteractiveFormatting
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>

			<ce-order-summary>
				<ce-divider></ce-divider>
				<ce-line-items></ce-line-items>
				<ce-divider></ce-divider>
				<ce-total class="ce-subtotal" total="subtotal">
					<span slot="description">
						{ __( 'Subtotal', 'checkout_engine' ) }
					</span>
				</ce-total>
				<CeCouponForm label={ __( 'Add Coupon Code' ) }>
					{ __( 'Apply Coupon', 'checkout_engine' ) }
				</CeCouponForm>
				<ce-divider></ce-divider>
				<ce-total
					class="ce-total"
					total="total"
					size="large"
					show-currency
				>
					<span slot="title">
						{ __( 'Total', 'checkout_engine' ) }
					</span>

					<span slot="subscription-title">
						{ __( 'Total Due Today', 'checkout_engine' ) }
					</span>
				</ce-total>
			</ce-order-summary>
		</CeFormSection>
	);
};

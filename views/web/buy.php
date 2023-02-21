<?php
/*
Template Name: SureCart
*/

use SureCartBlocks\Blocks\Form\Block as FormBlock;
use SureCartBlocks\Blocks\Payment\Block as PaymentBlock;


?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php do_action( 'surecart_buy_page_body_open' ); ?>

	<?php ob_start(); ?>

	<sc-columns is-stacked-on-mobile="1" is-full-height="1" style="gap:0">
		<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right has-background" style="border-style:none;border-width:0px;background-color:#fafafa;padding: var(--sc-spacing-xxxx-large);--sc-column-content-width:550px;--sc-form-row-spacing:25px">
			<!-- Product Image -->
			<?php if ( $product->image->url ) : ?>
				<figure>
					<img decoding="async" src="<?php echo esc_url( $product->image->url ); ?>" alt="<?php esc_attr( $product->name ); ?>" style="border-radius:var(--sc-border-radius-medium)" />
				</figure>
			<?php endif; ?>

			<!-- Product Name -->
			<sc-text style="--font-size: var(--sc-font-size-xx-large); --font-weight: var(--sc-font-weight-bold);"><?php echo wp_kses_post( $product->name ); ?></sc-text>

			<!-- Product Description -->
			<div>
				<?php echo wp_kses_post( $product->description ); ?>
			</div>

			<?php if ( ! empty( $product->prices->data ) && count( $product->prices->data ) > 1 ) : ?>
				<sc-price-choices type="radio" columns="1" class="wp-block-surecart-price-selector">
					<?php foreach ( $product->prices->data as $key => $price ) : ?>
						<sc-price-choice price-id="<?php echo esc_attr( $price->id ); ?>" type="radio" show-label show-price show-control></sc-price-choice>
					<?php endforeach; ?>
				</sc-price-choices>
			<?php endif; ?>
		</sc-column>

		<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-left has-ast-global-color-5-background-color has-background" style="padding: var(--sc-spacing-xxxx-large);--sc-column-content-width:550px;--sc-form-row-spacing:30px">
			<sc-customer-email class="" label="Email" placeholder="Your email address" required autocomplete='email' inputmode='email'></sc-customer-email>

			<sc-customer-name label="Name" placeholder="Your name" required class="wp-block-surecart-name"></sc-customer-name>

			<sc-order-shipping-address label="Address" full required="true" default-country="US" name-placeholder="Name or Company Name" country-placeholder="Country" city-placeholder="City" line-1-placeholder="Address" line-2-placeholder="Address Line 2" postal-code-placeholder="Postal Code/Zip" state-placeholder="State/Province/Region"></sc-order-shipping-address>

			<?php
			echo wp_kses_post(
				( new PaymentBlock() )->render(
					[
						'label' => __( 'Payment', 'surecart' ),
					],
				)
			);
			?>

			<sc-order-summary closed-text="Order Summary" open-text="Order Summary" class="wp-block-surecart-totals">
				<sc-order-coupon-form label="Add Coupon Code">Apply</sc-order-coupon-form>
				<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></sc-line-item-total>
				<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
				<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
			</sc-order-summary>
			<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true" class="wp-block-surecart-submit"><?php esc_html_e( 'Purchase', 'surecart' ); ?></sc-order-submit>
		</sc-column>
	</sc-columns>

	<?php
	$price = $product->prices->data[0];
	if ( $price ) {
		echo wp_kses_post(
			( new FormBlock() )->render(
				[
					'prices'  => [
						[
							'id'         => $price->id,
							'product_id' => $product->id,
							'quantity'   => 1,
						],
					],
					'mode'    => 'live',
					'form_id' => -1,
				],
				ob_get_clean()
			)
		);
	}
	?>


	<?php wp_footer(); ?>
</body>
</html>

<!-- wp:surecart/columns {"isFullHeight":true,"style":{"spacing":{"blockGap":{"top":"0px","left":"0px"}}}} -->
<sc-columns is-stacked-on-mobile="1" is-full-height="1" class="wp-block-surecart-columns" style="gap:0px 0px"><!-- wp:surecart/column {"layout":{"type":"constrained","contentSize":"550px","justifyContent":"right"},"width":"","style":{"spacing":{"padding":{"top":"100px","right":"100px","bottom":"100px","left":"100px"},"blockGap":"30px"},"border":{"width":"0px","style":"none"},"color":{"background":"#fafafa"}}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right has-background" style="border-style:none;border-width:0px;background-color:#fafafa;padding-top:100px;padding-right:100px;padding-bottom:100px;padding-left:100px;--sc-column-content-width:550px;--sc-form-row-spacing:30px">


		<?php if ( ! empty( $product->image->url ) ) : ?>
			<!-- wp:image {"sizeSlug":"full","linkDestination":"none","style":{"border":{"radius":"5px"}}} -->
				<figure class="wp-block-image size-full is-resized has-custom-border">
					<img src="<?php echo esc_url( $product->image->url ); ?>" alt="" style="border-radius:5px" />
				</figure>
			<!-- /wp:image -->
		<?php endif; ?>

		<!-- wp:paragraph {"fontSize":"medium"} -->
		<p class="has-medium-font-size"><strong><?php echo wp_kses_post( $product->name ); ?></strong></p>
		<!-- /wp:paragraph -->

		<div><?php echo wp_kses_post( $product->description ); ?></div>

		<?php if ( ! empty( $product->prices->data ) && count( $product->prices->data ) > 1 ) : ?>
			<!-- wp:surecart/price-selector -->
			<sc-price-choices type="radio" columns="1" class="wp-block-surecart-price-selector">
				<?php foreach ( $product->prices->data as $price ) : ?>
					<!-- wp:surecart/price-choice {"price_id":"<?php echo esc_attr( $price->id ); ?>","checked":true} -->
					<sc-price-choice class="wp-block-surecart-price-choice" price-id="<?php echo esc_attr( $price->id ); ?>" type="radio" show-label="1" show-price="1" show-control="1"></sc-price-choice>
					<!-- /wp:surecart/price-choice -->
				<?php endforeach; ?>
			</sc-price-choices>
			<!-- /wp:surecart/price-selector -->
		<?php endif; ?>

	</sc-column>
	<!-- /wp:surecart/column -->

	<!-- wp:surecart/column {"layout":{"type":"constrained","contentSize":"550px","justifyContent":"left"},"backgroundColor":"ast-global-color-5","style":{"spacing":{"padding":{"top":"100px","right":"100px","bottom":"100px","left":"100px"},"blockGap":"30px"}}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-left has-ast-global-color-5-background-color has-background" style="padding-top:100px;padding-right:100px;padding-bottom:100px;padding-left:100px;--sc-column-content-width:550px;--sc-form-row-spacing:30px"><!-- wp:surecart/email {"placeholder":"Your email address"} /-->

		<!-- wp:surecart/name {"required":true,"placeholder":"Your name"} -->
		<sc-customer-name label="Name" placeholder="Your name" required class="wp-block-surecart-name"></sc-customer-name>
		<!-- /wp:surecart/name -->

		<!-- wp:surecart/address /-->

		<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
		<sc-payment label="Payment" default-processor="stripe" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
		<!-- /wp:surecart/payment -->

		<!-- wp:surecart/totals {"collapsible":false,"collapsed":false,"closed_text":"Order Summary","open_text":"Order Summary"} -->
		<sc-order-summary closed-text="Order Summary" open-text="Order Summary" class="wp-block-surecart-totals"><!-- wp:surecart/coupon {"button_text":"Apply"} -->
			<sc-order-coupon-form label="Add Coupon Code">Apply</sc-order-coupon-form>
			<!-- /wp:surecart/coupon -->

			<!-- wp:surecart/subtotal -->
			<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></sc-line-item-total>
			<!-- /wp:surecart/subtotal -->

			<!-- wp:surecart/tax-line-item -->
			<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
			<!-- /wp:surecart/tax-line-item -->

			<!-- wp:surecart/total -->
			<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
			<!-- /wp:surecart/total --></sc-order-summary>
		<!-- /wp:surecart/totals -->

		<!-- wp:surecart/submit {"text":"Buy Now","show_total":true,"full":true} -->
		<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true" class="wp-block-surecart-submit">Buy Now</sc-order-submit>
		<!-- /wp:surecart/submit --></sc-column>
	<!-- /wp:surecart/column --></sc-columns>
<!-- /wp:surecart/columns -->

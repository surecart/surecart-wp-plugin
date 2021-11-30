<?php

namespace CheckoutEngine\WordPress;

/**
 * Service for installation related functions.
 */
class InstallService {

	public function install() {
		$this->createCheckoutForm();
		$this->createPages();
	}

	/**
	 * Create the main checkout form.
	 *
	 * @return void
	 */
	public function createCheckoutForm() {
		$forms = apply_filters(
			'checkout_engine/create_forms',
			[
				'checkout' => [
					'name'      => _x( 'checkout', 'Form slug', 'checkout_engine' ),
					'title'     => _x( 'Checkout', 'Form title', 'checkout_engine' ),
					'content'   => '<!-- wp:checkout-engine/form -->
					<!-- wp:checkout-engine/express-payment -->
					<ce-express-payment class="wp-block-checkout-engine-express-payment">or</ce-express-payment>
					<!-- /wp:checkout-engine/express-payment -->

					<!-- wp:checkout-engine/section-title {"text":"Contact Information"} -->
					<div class="wp-block-checkout-engine-section-title ce-section-title"><ce-text tag="h2" style="--font-size:var(--ce-form-title-font-size);--font-weight:var(--ce-form-title-font-weight);--color:var(--ce-form-title-font-color)">Contact Information</ce-text></div>
					<!-- /wp:checkout-engine/section-title -->

					<!-- wp:checkout-engine/name -->
					<ce-input label="Name" help="Optional" autocomplete="false" inputmode="false" spellcheck="false" name="name" type="text" class="wp-block-checkout-engine-name"></ce-input>
					<!-- /wp:checkout-engine/name -->

					<!-- wp:checkout-engine/email -->
					<ce-input label="Email" autocomplete="false" inputmode="false" spellcheck="false" type="email" name="email" required class="wp-block-checkout-engine-email"></ce-input>
					<!-- /wp:checkout-engine/email -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/section-title {"text":"Credit Card","description":""} -->
					<div class="wp-block-checkout-engine-section-title ce-section-title"><ce-text tag="h2" style="--font-size:var(--ce-form-title-font-size);--font-weight:var(--ce-form-title-font-weight);--color:var(--ce-form-title-font-color)">Credit Card</ce-text></div>
					<!-- /wp:checkout-engine/section-title -->

					<!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
					<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
					<!-- /wp:checkout-engine/payment -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/section-title {"text":"Totals"} -->
					<div class="wp-block-checkout-engine-section-title ce-section-title"><ce-text tag="h2" style="--font-size:var(--ce-form-title-font-size);--font-weight:var(--ce-form-title-font-weight);--color:var(--ce-form-title-font-color)">Totals</ce-text></div>
					<!-- /wp:checkout-engine/section-title -->

					<!-- wp:checkout-engine/totals -->
					<ce-order-summary class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:checkout-engine/divider -->

					<!-- wp:checkout-engine/line-items -->
					<ce-line-items class="wp-block-checkout-engine-line-items"></ce-line-items>
					<!-- /wp:checkout-engine/line-items -->

					<!-- wp:checkout-engine/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:checkout-engine/divider -->

					<!-- wp:checkout-engine/subtotal -->
					<ce-line-item-total class="ce-subtotal" total="subtotal" class="wp-block-checkout-engine-subtotal"><span slot="description">Subtotal</span></ce-line-item-total>
					<!-- /wp:checkout-engine/subtotal -->

					<!-- wp:checkout-engine/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
					<ce-coupon-form label="Add Coupon Code">Apply Coupon</ce-coupon-form>
					<!-- /wp:checkout-engine/coupon -->

					<!-- wp:checkout-engine/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:checkout-engine/divider -->

					<!-- wp:checkout-engine/total -->
					<ce-line-item-total class="ce-line-item-total" total="total" size="large" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
					<!-- /wp:checkout-engine/total --></ce-order-summary>
					<!-- /wp:checkout-engine/totals -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/submit -->
					<ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit">Purchase</ce-button>
					<!-- /wp:checkout-engine/submit -->
					<!-- /wp:checkout-engine/form -->
					',
					'post_type' => 'ce_form',
				],
			]
		);

		$this->createPosts( $forms );
	}

	/**
	 * Create pages that the plugin relies on, storing page IDs in variables.
	 *
	 * @return void
	 */
	public function createPages() {
		$form  = \CheckoutEngine::forms()->getDefault();
		$pages = apply_filters(
			'checkout_engine/create_pages',
			array(
				'checkout'           => [
					'name'    => _x( 'checkout', 'Page slug', 'checkout_engine' ),
					'title'   => _x( 'Checkout', 'Page title', 'checkout_engine' ),
					'content' => '<!-- wp:checkout-engine/checkout-form {"id":' . (int) $form->ID . '} -->
					<!-- wp:checkout-engine/form /-->
					<!-- /wp:checkout-engine/checkout-form -->',
				],
				'order-confirmation' => [
					'name'    => _x( 'order-confirmation', 'Page slug', 'checkout_engine' ),
					'title'   => _x( 'Order Confirmation', 'Page title', 'checkout_engine' ),
					'content' => '<!-- wp:checkout-engine/order-confirmation --> <!-- /wp:checkout-engine/order-confirmation -->',
				],
				'dashboard'          => [
					'name'    => _x( 'customer-dashboard', 'Page slug', 'checkout_engine' ),
					'title'   => _x( 'Customer Dashboard', 'Page title', 'checkout_engine' ),
					'content' => '<!-- wp:checkout-engine/dashboard --> <!-- /wp:checkout-engine/dashboard -->',
				],
			)
		);

		$this->createPosts( $pages );
	}

	/**
	 * Create posts from an array of post data.
	 *
	 * @param array $posts Array of post data.
	 * @return void
	 */
	public function createPosts( $posts ) {
		foreach ( $posts as $key => $post ) {
			\CheckoutEngine::pages()->findOrCreate(
				esc_sql( $post['name'] ),
				$key,
				$post['title'],
				$post['content'],
				! empty( $post['parent'] ) ? \CheckoutEngine::pages()->findOrCreate( $post['parent'] ) : '',
				! empty( $post['post_status'] ) ? $post['post_status'] : 'publish',
				! empty( $post['post_type'] ) ? $post['post_type'] : 'page'
			);
		}
	}
}

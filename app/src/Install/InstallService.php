<?php

namespace CheckoutEngine\Install;

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
			'surecart/create_forms',
			[
				'checkout' => [
					'name'      => _x( 'checkout', 'Form slug', 'surecart' ),
					'title'     => _x( 'Checkout', 'Form title', 'surecart' ),
					'content'   => '<!-- wp:surecart/form -->

					<!-- wp:surecart/express-payment -->
					<ce-express-payment divider-text="or" class="wp-block-surecart-express-payment"></ce-express-payment>
					<!-- /wp:surecart/express-payment -->

					<!-- wp:surecart/heading {"title":"Contact Information"} -->
					<ce-heading>Contact Information<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:surecart/heading -->

					<!-- wp:surecart/name -->
					<ce-input label="Name" autocomplete="false" inputmode="false" spellcheck="false" name="name" type="text" class="wp-block-surecart-name"></ce-input>
					<!-- /wp:surecart/name -->

					<!-- wp:surecart/email -->
					<ce-input label="Email" autocomplete="false" inputmode="false" spellcheck="false" type="email" name="email" required class="wp-block-surecart-email"></ce-input>
					<!-- /wp:surecart/email -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:surecart/heading {"title":"Credit Card"} -->
					<ce-heading>Credit Card<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:surecart/heading -->

					<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
					<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></ce-payment>
					<!-- /wp:surecart/payment -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:surecart/heading {"title":"Totals"} -->
					<ce-heading>Totals<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:surecart/heading -->

					<!-- wp:surecart/totals {"collapsible":false,"collapsed":false} -->
					<ce-order-summary class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:surecart/divider -->

					<!-- wp:surecart/line-items -->
					<ce-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></ce-line-items>
					<!-- /wp:surecart/line-items -->

					<!-- wp:surecart/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:surecart/divider -->

					<!-- wp:surecart/subtotal -->
					<ce-line-item-total class="ce-subtotal" total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></ce-line-item-total>
					<!-- /wp:surecart/subtotal -->

					<!-- wp:surecart/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
					<ce-coupon-form label="Add Coupon Code">Apply Coupon</ce-coupon-form>
					<!-- /wp:surecart/coupon -->

					<!-- wp:surecart/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:surecart/divider -->

					<!-- wp:surecart/total -->
					<ce-line-item-total class="ce-line-item-total" total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
					<!-- /wp:surecart/total --></ce-order-summary>
					<!-- /wp:surecart/totals -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:surecart/submit {"show_total":true,"full":true} -->
					<ce-button submit="1" type="primary" full="1" size="large" class="wp-block-surecart-submit"><svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewbox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Purchase<span> <ce-total></ce-total></span></ce-button>
					<!-- /wp:surecart/submit -->

					<!-- /wp:surecart/form -->
					',
					'post_type' => 'sc_form',
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
			'surecart/create_pages',
			array(
				'checkout'           => [
					'name'    => _x( 'checkout', 'Page slug', 'surecart' ),
					'title'   => _x( 'Checkout', 'Page title', 'surecart' ),
					'content' => '<!-- wp:surecart/checkout-form {"id":' . (int) $form->ID . '} -->
					<!-- wp:surecart/form /-->
					<!-- /wp:surecart/checkout-form -->',
				],
				'order-confirmation' => [
					'name'    => _x( 'order-confirmation', 'Page slug', 'surecart' ),
					'title'   => _x( 'Thank you!', 'Page title', 'surecart' ),
					'content' => '<!-- wp:surecart/order-confirmation --> <!-- /wp:surecart/order-confirmation -->',
				],
				'dashboard'          => [
					'name'    => _x( 'customer-dashboard', 'Page slug', 'surecart' ),
					'title'   => _x( 'Dashboard', 'Page title', 'surecart' ),
					'content' => '<!-- wp:surecart/dashboard --> <!-- /wp:surecart/dashboard -->',
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

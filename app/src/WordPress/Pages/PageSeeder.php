<?php

namespace CheckoutEngine\WordPress\Pages;

/**
 * Service for installation related functions.
 */
class PageSeeder {
	/**
	 * CheckoutEngine instance.
	 *
	 * @var \CheckoutEngine\WordPress\PostTypes\FormPostTypeService
	 */
	protected $forms = null;

	/**
	 * CheckoutEngine instance.
	 *
	 * @var \CheckoutEngine\WordPress\Pages\PageService
	 */
	protected $pages = null;

	/**
	 * Constructor.
	 *
	 * @param \CheckoutEngine\WordPress\PostTypes\FormPostTypeService $forms Forms service.
	 * @param \CheckoutEngine\WordPress\Pages\PageService             $pages Forms service.
	 */
	public function __construct( $forms, $pages ) {
		$this->forms = $forms;
		$this->pages = $pages;
	}

	/**
	 * Seed pages and forms.
	 *
	 * @return void
	 */
	public function seed() {
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
					<ce-express-payment divider-text="or" class="wp-block-checkout-engine-express-payment"></ce-express-payment>
					<!-- /wp:checkout-engine/express-payment -->

					<!-- wp:checkout-engine/heading {"title":"Contact Information"} -->
					<ce-heading>Contact Information<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:checkout-engine/heading -->

					<!-- wp:checkout-engine/name -->
					<ce-input label="Name" autocomplete="false" inputmode="false" spellcheck="false" name="name" type="text" class="wp-block-checkout-engine-name"></ce-input>
					<!-- /wp:checkout-engine/name -->

					<!-- wp:checkout-engine/email -->
					<ce-input label="Email" autocomplete="false" inputmode="false" spellcheck="false" type="email" name="email" required class="wp-block-checkout-engine-email"></ce-input>
					<!-- /wp:checkout-engine/email -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/heading {"title":"Credit Card"} -->
					<ce-heading>Credit Card<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:checkout-engine/heading -->

					<!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
					<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
					<!-- /wp:checkout-engine/payment -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/heading {"title":"Totals"} -->
					<ce-heading>Totals<span slot="description"></span><span slot="end"></span></ce-heading>
					<!-- /wp:checkout-engine/heading -->

					<!-- wp:checkout-engine/totals {"collapsible":false,"collapsed":false} -->
					<ce-order-summary class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
					<ce-divider></ce-divider>
					<!-- /wp:checkout-engine/divider -->

					<!-- wp:checkout-engine/line-items -->
					<ce-line-items removable="1" editable="1" class="wp-block-checkout-engine-line-items"></ce-line-items>
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
					<ce-line-item-total class="ce-line-item-total" total="total" size="large" show-currency="1" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
					<!-- /wp:checkout-engine/total --></ce-order-summary>
					<!-- /wp:checkout-engine/totals -->

					<!-- wp:spacer {"height":20} -->
					<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
					<!-- /wp:spacer -->

					<!-- wp:checkout-engine/submit {"show_total":true,"full":true} -->
					<ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit"><svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewbox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Purchase<span> <ce-total></ce-total></span></ce-button>
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
		$form = $this->forms->getDefault();

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
					'title'   => _x( 'Thank you!', 'Page title', 'checkout_engine' ),
					'content' => '<!-- wp:checkout-engine/order-confirmation --> <!-- /wp:checkout-engine/order-confirmation -->',
				],
				'dashboard'          => [
					'name'    => _x( 'customer-dashboard', 'Page slug', 'checkout_engine' ),
					'title'   => _x( 'Dashboard', 'Page title', 'checkout_engine' ),
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
			$this->pages->findOrCreate(
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

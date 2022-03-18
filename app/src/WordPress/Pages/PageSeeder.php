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
		$content = file_get_contents( plugin_dir_path( CHECKOUT_ENGINE_PLUGIN_FILE ) . 'templates/forms/default.html' );
		$content = '<!-- wp:checkout-engine/form -->' . $content . '<!-- /wp:checkout-engine/form -->';

		$forms = apply_filters(
			'checkout_engine/create_forms',
			[
				'checkout' => [
					'name'      => _x( 'checkout', 'Form slug', 'checkout_engine' ),
					'title'     => _x( 'Checkout', 'Form title', 'checkout_engine' ),
					'content'   => $content,
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
					'content' => file_get_contents( plugin_dir_path( CHECKOUT_ENGINE_PLUGIN_FILE ) . 'templates/confirmation/order-confirmation.html' ),
				],
				'dashboard'          => [
					'name'    => _x( 'customer-dashboard', 'Page slug', 'checkout_engine' ),
					'title'   => _x( 'Dashboard', 'Page title', 'checkout_engine' ),
					'content' => file_get_contents( plugin_dir_path( CHECKOUT_ENGINE_PLUGIN_FILE ) . 'templates/dashboard/customer-dashboard.html' ),
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

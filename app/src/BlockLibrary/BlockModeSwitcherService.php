<?php

declare(strict_types=1);

namespace SureCart\BlockLibrary;

use SureCartCore\Application\Application;

/**
 * Provide general block-related functionality.
 */
class BlockModeSwitcherService {
	/**
	 * View engine.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param Application $app Application Instance.
	 */
	public function __construct( Application $app ) {
		$this->app = $app;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_action( 'admin_bar_menu', [ $this, 'addAdminBarMenu' ], 99 );
	}

	/**
	 * Add admin bar menu.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addAdminBarMenu( $wp_admin_bar ): void {
		// We don't want to show this in admin area.
		if ( is_admin() ) {
			return;
		}

		/**
		 * @var \WP_Post
		 */
		$post = $this->getCheckoutFormPost();
		$checkout_form_post = $this->getBlockFromPost( $post );

		if ( ! $checkout_form_post ) {
			return;
		}

		$mode = $checkout_form_post['attrs']['mode'] ?? 'live';
		$wp_admin_bar->add_menu(
			[
				'id'    => 'sc_change_checkout_mode',
				'title' => '<span style="color: ' . ( 'live' === $mode ? '#49de80' : '#fbbf24' ) .'; font-weight: bold; font-size: 25px; line-height: 1;">•</span> '
					. '<span style="color: ' . ( 'test' === $mode ? '#fef3c7' : '#fff' ) .';">'
					. __( 'Checkout Form', 'surecart' )
					. ' (' . ( 'test' === $mode ? __( 'Test', 'surecart' ) : __( 'Live', 'surecart' ) ) . ')'
					. '</span>',
			]
		);

		$url = add_query_arg(
			[
				'sc_checkout_change_mode' => $post->ID,
				'nonce'                   => wp_create_nonce( 'update_checkout_mode' ),
				'sc_redirect_url'         => remove_query_arg( 'sc_checkout_change_mode' ),
			],
			get_home_url( null, 'surecart/change-checkout-mode' )
		);

		$sub_items = [
			[
				'id'    => 'sc_live_mode',
				'title' => '<div style="display:flex; justify-content: space-between;"><div><span style="color: #49de80; font-weight: bold; font-size: 25px; line-height: 1;">• ' . '</span><span>' . __( 'Live Mode', 'surecart' ) . '</div><div>' . ( $mode === 'live' ? ' ✓' : '' ) . '</span></div></div>',
				'href'  => 'live' === $mode ? '#' : $url . '&mode=live',
			],
			[
				'id'    => 'sc_test_mode',
				'title' => '<div style="display:flex; justify-content: space-between;"><div><span style="color: #fbbf24; font-weight: bold; font-size: 25px; line-height: 1;">• ' . '</span><span style="color: #fef3c7;">' . __( 'Test Mode', 'surecart' ) . '</div><div>' . ( $mode === 'test' ? ' ✓' : '' ). '</span></div></div>',
				'href'  => 'test' === $mode ? '#' : $url . '&mode=test',
			],
		];

		foreach ( $sub_items as $sub_item ) {
			$wp_admin_bar->add_menu(
				[
					'parent' => 'sc_change_checkout_mode',
					'id'     => $sub_item['id'],
					'title'  => $sub_item['title'],
					'href'   => $sub_item['href'],
				]
			);
		}
	}

	/**
	 * Get checkout form post.
	 *
	 * @return object|null
	 */
	public function getCheckoutFormPost() {
		$post_id = get_the_ID();

		// Get post.
		$post = get_post( $post_id );

		if ( ! $post ) {
			return null;
		}

		// Check post has block surecart/checkout-form and then check the attributes.
		$blocks = parse_blocks( $post->post_content );

		if ( ! has_block( 'surecart/checkout-form', $post ) ) {
			return null;
		}

		$checkout_form_block = array_filter(
			$blocks,
			function ( $block ) {
				return 'surecart/checkout-form' === $block['blockName'];
			}
		);

		// Get the form post id.
		$checkout_form_post_id = $checkout_form_block[0]['attrs']['id'] ?? null;

		if ( ! $checkout_form_post_id ) {
			return null;
		}

		return get_post( $checkout_form_post_id ) ?? null;
	}

	/**
	 * Get block from post.
	 *
	 * @param \WP_Post $checkout_form_post The checkout form post.
	 *
	 * @return array|null
	 */
	public function getBlockFromPost( $checkout_form_post ) {
		if ( ! $checkout_form_post ) {
			return null;
		}

		$checkout_form_inner_block = parse_blocks( $checkout_form_post->post_content );

		// Find the block with surecart/form.
		return array_filter(
			$checkout_form_inner_block,
			function ( $block ) {
				return 'surecart/form' === $block['blockName'];
			}
		)[0] ?? null;
	}
}

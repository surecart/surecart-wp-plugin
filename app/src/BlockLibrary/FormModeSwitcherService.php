<?php

declare(strict_types=1);

namespace SureCart\BlockLibrary;

/**
 * Provide general block-related functionality.
 */
class FormModeSwitcherService {
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
		 * The checkout form post.
		 *
		 * @var \WP_Post $checkout_form_post
		 */
		$form_post           = \SureCart::post()->getFormPostFromBlock( get_post() );
		$checkout_form_block = wp_get_first_block( parse_blocks( $form_post->post_content ), 'surecart/form' );
		if ( empty( $checkout_form_block ) ) {
			return;
		}

		$mode = $checkout_form_block['attrs']['mode'] ?? 'live';
		$wp_admin_bar->add_menu(
			[
				'id'    => 'sc_change_checkout_mode',
				'title' => '<span style="color: #000; background-color: ' . ( 'live' === $mode ? '#49de80' : '#fbbf24' ) . '; font-size: 12px; line-height: 1; border-radius: 4px; padding: 2px 6px;">'
					. ( 'live' === $mode ? __('LIVE', 'surecart') : __('TEST', 'surecart') )
					. '</span> '
					. '<span style="color: ' . ( 'test' === $mode ? '#FEF3C7' : '#DCFCE7' ) . ';">'
					. __( 'Checkout Form', 'surecart' )
					. '</span>',
			]
		);

		$url = add_query_arg(
			[
				'sc_checkout_change_mode' => $form_post->ID,
				'sc_checkout_post'        => get_the_ID(),
				'nonce'                   => wp_create_nonce( 'update_checkout_mode' ),
			],
			get_home_url( null, 'surecart/change-checkout-mode' )
		);

		$sub_items = [
			[
				'id'    => 'sc_live_mode',
				'title' => '<div style="display:flex; justify-content: space-between;"><div><span style="color: #49de80; font-weight: bold; font-size: 16px; line-height: 1;">• </span><span style="color: #DCFCE7;">' . __( 'Live Mode', 'surecart' ) . '</div><div>' . ( 'live' === $mode ? ' ✓' : '' ) . '</span></div></div>',
				'href'  => 'live' === $mode ? '#' : $url . '&mode=live',
			],
			[
				'id'    => 'sc_test_mode',
				'title' => '<div style="display:flex; justify-content: space-between;"><div><span style="color: #fbbf24; font-weight: bold; font-size: 16px; line-height: 1;">• </span><span style="color: #FEF3C7;">' . __( 'Test Mode', 'surecart' ) . '</div><div>' . ( 'test' === $mode ? ' ✓' : '' ) . '</span></div></div>',
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
		$post = get_post();

		if ( ! $post ) {
			return null;
		}

		// Check post has block surecart/checkout-form and then check the attributes.
		$blocks = parse_blocks( $post->post_content );

		if ( ! has_block( 'surecart/checkout-form', $post ) ) {
			return null;
		}

		$checkout_form_block = wp_get_first_block( $blocks, 'surecart/checkout-form' );

		// Get the form post id.
		$checkout_form_post_id = $checkout_form_block['attrs']['id'] ?? null;

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

		// Find the surecart/form block.
		return wp_get_first_block( $checkout_form_inner_block, 'surecart/form' );
	}
}

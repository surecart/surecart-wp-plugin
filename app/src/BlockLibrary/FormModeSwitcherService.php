<?php

declare(strict_types=1);

namespace SureCart\BlockLibrary;

/**
 * Provide general block-related functionality.
 */
class FormModeSwitcherService {
	/**
	 * Whether the ui has been rendered.
	 *
	 * @var bool
	 */
	protected static $rendered = false;

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_action( 'admin_bar_menu', [ $this, 'addAdminBarMenu' ], 99 );
		add_action( 'wp_after_admin_bar_render', [ $this, 'confirmScript' ] );
	}

	/**
	 * Get the menu title.
	 *
	 * @param string $mode The mode.
	 *
	 * @return string
	 */
	public function getMenuTitle( $mode = 'live' ) {
		ob_start(); ?>

		<span style="color: #fff;">
			<?php echo esc_html__( 'Checkout Form', 'surecart' ); ?>
		</span>
		<span style="color: <?php echo 'live' === $mode ? 'var(--sc-color-success-900, #21382a)' : 'var(--sc-color-warning-900, #4d3d11)'; ?>; display: inline-block; background-color: <?php echo 'live' === $mode ? 'var(--sc-color-success-400, #49de80)' : 'var(--sc-color-warning-400, #fbbf24)'; ?>; font-size: 10px; line-height: 1; border-radius: 999px; padding: 3px 6px; margin: 0 5px; text-transform: uppercase; font-weight: bold;">
			<?php echo 'live' === $mode ? esc_html__( 'Live Mode', 'surecart' ) : esc_html__( 'Test Mode', 'surecart' ); ?>
		</span>

		<?php
		return ob_get_clean();
	}

	/**
	 * Get the menu item.
	 *
	 * @param string $mode The mode.
	 * @param bool   $is_selected Whether the item is selected.
	 *
	 * @return string
	 */
	public function getMenuItem( $mode = 'live', $is_selected ) {
		ob_start();
		?>
		<span style="display: flex; justify-content: space-between;">
			<span>
				<span style="color: <?php echo 'live' === $mode ? 'var(--sc-color-success-400, #21382a)' : 'var(--sc-color-warning-400, #4d3d11)'; ?>; font-weight: bold; font-size: 16px; line-height: 1;">• </span>
				<span style="color: <?php echo 'live' === $mode ? 'var(--sc-color-success-100, #49de80)' : 'var(--sc-color-warning-100, #fbbf24)'; ?>;">
					<?php echo 'live' === $mode ? esc_html__( 'Live Mode', 'surecart' ) : esc_html__( 'Test Mode', 'surecart' ); ?>
				</span>
			</span>
			<span>
				<?php echo $is_selected ? ' ✓' : ''; ?>
			</span>
		</span>
		<?php
		return ob_get_clean();
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
		$url  = add_query_arg(
			[
				'sc_checkout_change_mode' => $form_post->ID,
				'sc_checkout_post'        => get_the_ID(),
				'nonce'                   => wp_create_nonce( 'update_checkout_mode' ),
			],
			get_home_url( null, 'surecart/change-checkout-mode' )
		);

		$wp_admin_bar->add_menu(
			[
				'id'    => 'sc_change_checkout_mode',
				'title' => $this->getMenuTitle( $mode ),
			]
		);

		$wp_admin_bar->add_menu(
			[
				'parent' => 'sc_change_checkout_mode',
				'id'     => 'sc_live_mode',
				'title'  => $this->getMenuItem( 'live', 'live' === $mode ),
				'href'   => 'live' === $mode ? '#' : $url,
			]
		);

		$wp_admin_bar->add_menu(
			[
				'parent' => 'sc_change_checkout_mode',
				'id'     => 'sc_test_mode',
				'title'  => $this->getMenuItem( 'test', 'test' === $mode ),
				'href'   => 'test' === $mode ? '#' : $url,
			],
		);

		// Mark as rendered.
		self::$rendered = true;
	}

	/**
	 * Confirm script.
	 *
	 * @return void
	 */
	public function confirmScript() {
		if ( ! self::$rendered ) {
			return;
		}
		?>
		<script>
			const items = document.querySelectorAll('#wp-admin-bar-sc_change_checkout_mode a:not([href="#"])');
			(items || []).forEach(item => {
				item.addEventListener('click', function(e) {
					if (!confirm('<?php echo esc_js( __( "Notice: Cart Contents Will Be Mode-Specific. \n\nYou are about to switch your checkout mode. It's important to note that cart items are specific to each mode and will not be transferred between them.", 'surecart' ) ); ?>')) {
						e.preventDefault();
					}
				})
			});
		</script>
		<?php
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

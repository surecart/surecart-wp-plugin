<?php

namespace SureCart\Cart;

use SureCart\Models\Form;

/**
 * The cart service.
 */
class CartService {
	/**
	 * Bootstrap the cart.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'wp_nav_menu_items', [ $this, 'addCartMenu' ], 10, 2 );

		// only load scripts if cart is enabled.
		if ( $this->isCartEnabled() ) {
			add_action(
				'wp_enqueue_scripts',
				function () {
					\SureCart::assets()->enqueueComponents();
				}
			);
			add_action( 'wp_footer', [ $this, 'renderCartComponent' ] );
		}
	}


	/**
	 * Get selected ids.
	 *
	 * @return array|false
	 */
	public function getSelectedIds() {
		return get_option( 'surecart_cart_menu_selected_ids', false );
	}

	/**
	 * Get icon type.
	 *
	 * @return array|false
	 */
	public function getIconType() {
		return get_option( 'surecart_cart_icon_type', 'floating_icon' );
	}

	/**
	 * Check if cart menu is always shown.
	 *
	 * @return boolean
	 */
	public function isAlwaysShown() {
		return (bool) get_option( 'surecart_cart_menu_always_shown', false );
	}

	/**
	 * Is the cart enabled?
	 */
	public function isCartEnabled() {
		return ! (bool) get_option( 'sc_slide_out_cart_disabled', false );
	}

	/**
	 * Get cart menu alignment.
	 *
	 * @return 'left'|'right
	 */
	public function getAlignment() {
		return (string) get_option( 'surecart_cart_menu_alignment', 'right' );
	}

	/**
	 * Get mode.
	 *
	 * @return string
	 */
	public function getMode() {
		$form = $this->getForm();
		return Form::getMode( $form->ID );
	}

	/**
	 * Add cart to menu.
	 *
	 * @param array  $items Menu items.
	 * @param object $args Menu args.
	 *
	 * @return array
	 */
	public function addCartMenu( $items, $args ) {
		if ( ! $this->isMenuIconEnabled( $args->menu->term_id ) || ! $this->isCartEnabled() ) {
			return $items;
		}

		$cart_menu_alignment = $this->getAlignment();

		$menu = $this->menuItemTemplate();

		// left or right.
		$items = 'right' === $cart_menu_alignment ? $items . $menu : $menu . $items;

		return $items;
	}

	public function menuItemTemplate() {
		$form = $this->getForm();
		$mode = $this->getMode();

		ob_start(); ?>
			<li>
				<sc-cart-button
					href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
					class='menu-item'
					cart-menu-always-shown='<?php echo esc_attr( $this->isAlwaysShown() ? 'true' : 'false' ); ?>'
					form-id='<?php echo esc_attr( $form->ID ); ?>'
					mode='<?php echo esc_attr( $mode ); ?>'>
				</sc-cart-button>
			</li>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the cart template.
	 *
	 * @return string
	 */
	public function cartTemplate() {
		$form = $this->getForm();

		if ( empty( $form->ID ) ) {
			return '';
		}

		$cart = \SureCart::cartPost()->get();

		if ( empty( $cart->post_content ) ) {
			return '';
		}

		$floating_icon_enabled = $this->isFloatingIconEnabled() ? 'false' : 'true';

		ob_start();
		?>

		<sc-cart
			id="sc-cart"
			header="<?php esc_attr_e( 'Cart', 'surecart' ); ?>"
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			checkout-link="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
			style="font-size: 16px"
			floating-icon-enabled="<?php echo esc_attr( $floating_icon_enabled ); ?>"
		>
			<?php echo wp_kses_post( do_blocks( $cart->post_content ) ); ?>
		</sc-cart>

		<?php
		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}

	/**
	 * Render the cart components.
	 *
	 * @return void
	 */
	public function renderCartComponent() {
		$form = $this->getForm();
		if ( empty( $form->ID ) ) {
			return;
		}
		$template = $this->cartTemplate();
		?>
		<sc-cart-loader
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			template='<?php echo esc_attr( $template ); ?>'>
		</sc-cart-loader>
		<?php
	}

	/**
	 * Get the form
	 *
	 * @return \WP_Post The default form post.
	 */
	public function getForm() {
		return \SureCart::forms()->getDefault();
	}

	/**
	 * Check if floating cart icon is enabled
	 *
	 * @return string
	 */
	public function isFloatingIconEnabled() {
		$cart_icon_type = (string) get_option( 'surecart_cart_icon_type', null );
		return 'menu_icon' === $cart_icon_type;
	}

	/**
	 * Check if menu cart icon is enabled
	 *
	 * @param integer $term_id Term ID.
	 * @return bool
	 */
	public function isMenuIconEnabled( $term_id ) {
		$cart_menu_ids  = (array) $this->getSelectedIds();
		$cart_icon_type = (string) $this->getIconType();
		if ( ! in_array( $cart_icon_type, [ 'menu_icon', 'both' ] ) ) {
			return;
		}
		return in_array( $term_id, $cart_menu_ids );
	}
}

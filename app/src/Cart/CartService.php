<?php

namespace SureCart\Cart;

use SureCart\Models\Form;

/**
 * The cart service.
 */
class CartService
{
    /**
     * Bootstrap the cart.
     *
     * @return void
     */
    public function bootstrap() {
        // Slide-out is disabled. Do not load scripts.
        if ((bool) get_option('sc_slide_out_cart_disabled', false)) {
            return;
        }

        // enqueue scripts needed for slide out cart.
        add_action(
            'wp_enqueue_scripts',
            function () {
                \SureCart::assets()->enqueueComponents();
            }
        );
        add_action('wp_footer', [$this, 'renderCartComponent']);
    }

    /**
     * Get the cart template.
     *
     * @return string
     */
    public function cartTemplate() {
        $form = $this->getForm();

        if (empty($form->ID)) {
            return '';
        }

        $cart = \SureCart::cartPost()->get();

        if (empty($cart->post_content)) {
            return '';
        }

        $floating_icon_enabled = $this->isFloatingIconEnabled();

        ob_start();
        ?>

		<sc-cart
			id="sc-cart"
			header="<?php esc_attr_e('Cart', 'surecart');?>"
			form-id="<?php echo esc_attr($form->ID); ?>"
			mode="<?php echo esc_attr(Form::getMode($form->ID)); ?>"
			checkout-link="<?php echo esc_attr(\SureCart::pages()->url('checkout')); ?>"
			style="font-size: 16px"
			floating-icon-enabled="<?php echo esc_attr( $floating_icon_enabled ); ?>"
		>
			<?php echo wp_kses_post(do_blocks($cart->post_content)); ?>
		</sc-cart>

		<?php
        return trim(preg_replace('/\s+/', ' ', ob_get_clean()));
    }

    /**
     * Render the cart components.
     *
     * @return void
     */
    public function renderCartComponent() {
        $form = $this->getForm();
        if (empty($form->ID)) {
            return;
        }
        $template = $this->cartTemplate();
        ?>
		<sc-cart-loader
			form-id="<?php echo esc_attr($form->ID); ?>"
			mode="<?php echo esc_attr(Form::getMode($form->ID)); ?>"
			template='<?php echo esc_attr($template); ?>'>
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
        $cart_icon_type = (string) get_option('surecart_cart_icon_type', null);
        return $cart_icon_type === 'menu_icon' ? 'false' : 'true';
    }
    
    /**
     * Check if menu cart icon is enabled
     * 
     * @param integer $term_id Term ID.
     * @return bool
     */
    public function isMenuIconEnabled( $term_id ) {
        $cart_menu_ids    = (array) get_option( 'surecart_cart_menu_selected_ids', null );
		$cart_icon_type   = (string) get_option( 'surecart_cart_icon_type', null );
        
        return $cart_icon_type === 'floating_icon' || !in_array( $term_id, $cart_menu_ids );
    }
}

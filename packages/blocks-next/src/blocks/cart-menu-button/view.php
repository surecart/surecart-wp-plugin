<div
	class="sc-cart-block"
	data-wp-interactive='{ "namespace": "surecart/dialog" }'
>
    <button
        style="<?php echo esc_attr( $style ); ?> line-height: 0;" data-wp-on--click='actions.toggle'
        data-wp-on--click='actions.toggle'
        class="sc-cart__button"
        cart-menu-always-shown='<?php echo esc_attr( ! empty( $attributes['cart_menu_always_shown'] ) ? 'true' : 'false' ); ?>'
        form-id='<?php echo esc_attr( $form->ID ); ?>'
        mode='<?php echo esc_attr( $mode ); ?>'>
        <?php echo wp_kses( $icon, sc_allowed_svg_html() ); ?>
    </button>
</div>

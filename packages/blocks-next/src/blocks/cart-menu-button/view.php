<a
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-on--click="surecart/dialog::actions.toggle"
    data-wp-on--click="surecart/checkout::actions.toggleCartSidebar"
    cart-menu-always-shown='<?php echo esc_attr( ! empty( $attributes['cart_menu_always_shown'] ) ? 'true' : 'false' ); ?>'
    form-id='<?php echo esc_attr( $form->ID ); ?>'
    mode='<?php echo esc_attr( $mode ); ?>'
>
    <?php echo wp_kses( $icon, sc_allowed_svg_html() ); ?>
</a>

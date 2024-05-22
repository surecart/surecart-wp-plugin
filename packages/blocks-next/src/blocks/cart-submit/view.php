<div
    class="wp-block-buttons sc-cart-submit__wrapper"
    style="<?php echo wp_kses_post( $style ); ?>"
>
    <a
        href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
        class="wp-block-button wp-block-button__link wp-element-button sc-button"
        <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    >
        <span><?php echo wp_kses_post( $attributes['text'] ); ?></span>
    </a>
</div>

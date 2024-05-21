<div class="wp-block-buttons sc-cart-submit__wrapper">
    <a
        href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
        class="wp-block-button wp-block-button__link wp-element-button sc-button"
    >
        <span><?php echo wp_kses_post( $attributes['text'] ); ?></span>
    </a>
</div>

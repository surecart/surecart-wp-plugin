<div
    class="wp-block-surecart-cart-header-v2"
    <?php echo get_block_wrapper_attributes( array( 'style' => $style ) ); ?>
>
    <?php echo wp_kses( SureCart::svg()->get('arrow-right', [ 'class' => 'wp-block-surecart-cart-header-v2__close' ] ), sc_allowed_svg_html() ); ?>
    <span class="wp-block-surecart-cart-header-v2__title">
        <?php echo esc_html( $attributes['text'] ); ?>
    </span>
    <span class="sc-tag sc-tag--default">
        <span data-wp-text="state.getItemsCount"></span>
    </span>
</div>

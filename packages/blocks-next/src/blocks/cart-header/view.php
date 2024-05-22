<div
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
>
	<span class="wp-block-surecart-cart-header-v2__close" role="button" tabindex="0">
    	<?php echo wp_kses( SureCart::svg()->get('arrow-right' ), sc_allowed_svg_html() ); ?>
	</span>

    <span class="wp-block-surecart-cart-header-v2__title">
        <?php echo esc_html( $attributes['text'] ); ?>
    </span>

    <span class="sc-tag sc-tag--default">
        <span data-wp-text="state.getItemsCount"></span>
    </span>
</div>

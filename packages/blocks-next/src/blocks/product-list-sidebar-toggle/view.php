<div 
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-on--click="surecart/product-list::actions.toggleSidebar"
    data-wp-on--keydown="surecart/product-list::actions.toggleSidebar"
    aria-haspopup="dialog"
    aria-label="<?php esc_attr_e( 'Open sidebar', 'surecart' ); ?>"
    role="button"
    tabindex="0"
>
    <?php
        echo wp_kses(
            SureCart::svg()->get(
                'filter',
                [
                    'aria-label' => __(
                        'Open sidebar',
                        'surecart'
                    ),
                ],
            ),
            sc_allowed_svg_html()
        );
        if ( ! empty( $attributes['label'] ) ) {
            echo esc_html( $attributes['label'] );
        }
    ?>
</div>

<button 
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-on--click="surecart/product-list::actions.toggleSidebar"
    aria-haspopup="dialog"
    aria-label="<?php esc_attr_e( 'Open sidebar', 'surecart' ); ?>"
>
    <?php
        echo wp_kses(
            SureCart::svg()->get(
                'menu',
                [
                    'aria-label' => __(
                        'Open sidebar',
                        'surecart'
                    ),
                ],
            ),
            sc_allowed_svg_html()
        );
    ?>
</button>

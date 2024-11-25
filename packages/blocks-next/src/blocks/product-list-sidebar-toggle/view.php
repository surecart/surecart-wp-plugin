<div 
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    data-wp-on--click="surecart/product-list::actions.toggleSidebar"
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
</div>

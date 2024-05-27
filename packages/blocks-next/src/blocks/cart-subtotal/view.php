<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
    <div
        class="sc-product-line-item"
        style="margin-bottom: 20px;"
    >
        <div class="sc-product-line-item__item">
            <div class="sc-product-line-item__text">
                <div class="sc-product-line-item__text-details">
                    <div class="sc-product-line-item__title">
                        <span>
                            <?php echo wp_kses_post( $attributes['label'] ?? __( 'Total', 'surecart' ) ); ?>
                        </span>
                    </div>
                </div>
            </div>

            <div class="sc-product-line-item__suffix">
                <div class="sc-product-line-item__price">
                    <div class="price">
                        <span data-wp-text="state.checkout.display_subtotal_amount"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
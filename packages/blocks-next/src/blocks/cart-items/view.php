<div
    class="wp-block-surecart-cart-items__wrapper"
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
>
	<template
		data-wp-each--line_item="state.checkout.line_items.data"
		data-wp-key="context.line_item.id"
	>
        <div
            class="sc-product-line-item"
            style="margin-bottom: 20px;"
        >
            <div class="sc-product-line-item__item">
                <img
                    data-wp-bind--src="context.line_item.price.product.image_url"
                    class="sc-product-line-item__image"
                    alt=""
                />

                <div class="sc-product-line-item__text">
                    <div class="sc-product-line-item__text-details">
                        <div class="sc-product-line-item__title">
                            <span data-wp-text="context.line_item.price.product.name"></span>
                        </div>
                        <div class="sc-product-line-item__description sc-product-line-item__price-variant">
                            <div data-wp-text="context.line_item.price.name"></div>
                        </div>
                        <?php if ( ! $attributes['editable'] ): ?>
                            <span class="sc-product-line-item__description">
                                <?php esc_html_e('Qty:', 'surecart'); ?>
                                <span data-wp-text="context.line_item.quantity"></span>
                            </span>
                        <?php endif; ?>
                        <?php if ( $attributes['editable'] ): ?>
                            <div class="sc-quantity-selector quantity--small" style="margin-top: var(--sc-spacing-xx-small);">
                                <div role="button" class="sc-quantity-selector__decrease">
                                    <?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
                                </div>
                                <input
                                    class="sc-quantity-selector__control"
                                    data-wp-bind--value="context.line_item.quantity"
                                    data-wp-bind--min="context.line_item.min"
                                    data-wp-bind--aria-valuemin="context.line_item.min"
                                    data-wp-bind--max="context.line_item.max"
                                    data-wp-bind--aria-valuemax="context.line_item.max"
                                    data-wp-bind--aria-disabled="context.line_item.disabled"
                                    type="number"
                                    step="1"
                                    autocomplete="off"
                                />
                                <div role="button" class="sc-quantity-selector__increase">
                                    <?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="sc-product-line-item__suffix">
                    <?php if ( $attributes['removable'] ): ?>
                        <?php echo wp_kses( SureCart::svg()->get('x', [ 'class' => 'sc-product-line-item__remove' ] ), sc_allowed_svg_html() ); ?>
                    <?php endif; ?>

                    <div class="sc-product-line-item__price">
                        <div class="price">
                            <span
                                data-wp-bind--hidden="!state.lineItemHasScratchAmount"
                                data-wp-text="context.line_item.price.scratchAmount"
                            ></span>
                            <span data-wp-text="context.line_item.price.display_amount"></span>
                        </div>
                        <div
                            data-wp-bind--hidden="!context.line_item.price.interval"
                            class="sc-product-line-item__price__description"
                            data-wp-text="context.line_item.price.interval"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</template>
</div>

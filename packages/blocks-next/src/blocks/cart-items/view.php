<div
    class="wp-block-surecart-cart-items__wrapper"
    style="min-height: 400px; border-bottom: var(--sc-drawer-border); padding: 1.25em;"
>
	<template
		data-wp-each--line_item="state.checkout.line_items.data"
		data-wp-key="state.checkout.line_item.id"
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
                        <?php if (!$attributes['editable']): ?>
                            <span class="sc-product-line-item__description">
                                <?php _e('Qty:', 'surecart'); ?>
                                <span data-wp-text="context.line_item.quantity"></span>
                            </span>
                        <?php endif; ?>
                        <?php if ($attributes['editable']): ?>
                            <!-- Handle Editable Input -->
                        <?php endif; ?>
                    </div>
                </div>
                <div class="sc-product-line-item__suffix">
                    <?php if ($attributes['removable']): ?>
                        <?php echo wp_kses( SureCart::svg()->get('x', [ 'class' => 'sc-product-line-item__remove' ] ), sc_allowed_svg_html() ); ?>
                    <?php endif; ?>

                    <div class="sc-product-line-item__price">
                        <div class="price">
                            <span
                                data-wp-hidden="contex.line_item.price.scratchAmount !== contex.line_item.price.amount"
                                data-wp-text="contex.line_item.price.scratchAmount"
                            ></span>
                            <span data-wp-text="context.line_item.price.amount"></span>
                        </div>
                        <div
                            data-wp-hidden="!contex.line_item.price.interval"
                            class="sc-product-line-item__price__description"
                            data-wp-text="contex.line_item.price.interval"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</template>
</div>

<div
    class="sc-cart-coupon__wrapper"
    style="padding: 1.25em;"
    <?php echo get_block_wrapper_attributes(); ?>
>
    <!-- Discount applied Applied coupon UI -->
    <div
        class="sc-line-item__item sc-coupon-form"
        data-wp-bind--hidden="!state.isDiscountAdded"
        hidden
    >
        <div class="sc-line-item__text">
            <div class="sc-line-item__description">
                <?php esc_html_e( 'Discount', 'surecart' ); ?>
                <span class="sc-tag sc-tag--default" data-wp-text="state.checkout.discount.promotion.code"></span>
            </div>
        </div>

        <div class="sc-line-item__end">
            <div class="sc-line-item__price-text">
                <div class="sc-line-item__price-description">
                    <!-- redeemable UI -->
                    <span data-wp-bind--hidden="!state.checkout.discount_amount">
                        <span
                            data-wp-bind--hidden="!state.discountIsRedeemable"
                            class="coupon-human-discount"
                            data-wp-text="state.checkout.discount_amount"
                        ></span>
                    </span>

                    <!-- non-redeemable UI -->
                    <span
                        data-wp-bind--hidden="!state.discountIsRedeemable"
                        class="coupon__status"
                    >
                        <?php echo wp_kses( SureCart::svg()->get('alert-triangle', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
                        <span data-wp-text="state.checkout.discount.redeemable_status"></span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Discount -->
    <div
        class="sc-coupon-form"
        data-wp-bind--hidden="state.isDiscountAdded"
    >
        <div style="margin-top: var(--sc-spacing-small, 10px);">
            <?php if ( $attributes['collapsed'] ): ?>
                Collapsed UI.
            <?php else: ?>
                <div>
                    <button
                        data-wp-bind--hidden="!state.discountInputOpen"
                        class="sc-button--link"
                        data-wp-on--click='actions.toggleDiscountInput()'>
                        <?php esc_html_e( 'Add coupon code', 'surecart' ); ?>
                    </button>

                    <div hidden data-wp-bind--hidden="state.discountInputOpen" class="sc-input-group">
                        <input type="text" id="coupon" class="sc-form-control" aria-label="quantity" aria-describedby="basic-addon1" value="101010">
                        <span class="sc-input-group-text" id="basic-addon1" style="opacity: 1;">
                            <button style="background: transparent; border: 0; font-size: var(--sc-button-font-size-medium); cursor: pointer; color: var(--sc-color-primary-500); font-weight: var(--sc-font-weight-semibold);">
                                <?php esc_html_e( 'Apply', 'surecart' ); ?>
                            </button>
                        </span>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

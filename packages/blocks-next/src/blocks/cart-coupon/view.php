<div
    class="sc-cart-coupon__wrapper"
    style="padding: 1.25em;"
>
    <!-- Applied coupon UI -->
    <div data-wp-bind--hidden="!state.checkout.discount.promotion.code" class="sc-line-item__item sc-coupon-form">
        <div class="sc-line-item__text">
            <div class="sc-line-item__description" part="description">
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
                            data-wp-bind--hidden="state.checkout.discount.redeemable_status !== 'redeemable'"
                            class="coupon-human-discount"
                            data-wp-text="state.checkout.discount_amount"
                        ></span>
                    </span>

                    <!-- non-redeemable UI -->
                    <span
                        data-wp-bind--hidden="state.checkout.discount.redeemable_status === 'redeemable'"
                        class="coupon__status"
                    >
                        <?php echo wp_kses( SureCart::svg()->get('alert-triangle', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
                        <span data-wp-text="state.checkout.discount.redeemable_status"></span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Create coupon form UI -->
</div>

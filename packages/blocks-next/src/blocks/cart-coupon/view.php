<div
    <?php echo wp_kses_data( get_block_wrapper_attributes(
		array(
			'style' => $style,
		)
	) ); ?>
    <?php
        echo wp_kses_data(
            wp_interactivity_data_wp_context(
                [
                    'discountInputOpen' => false,
                ]
            )
        );
    ?>
    data-wp-on-document--click="surecart/checkout::actions.closeCouponOnClickOutside"
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
                <span class="sc-tag sc-tag--default">
                    <span data-wp-text="state.checkout.discount.promotion.code"></span>
                    <button data-wp-on--click="actions.removeDiscount">
                        <?php echo wp_kses( SureCart::svg()->get('x', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
                    </button>
                </span>
            </div>
        </div>

        <div class="sc-line-item__end">
            <div class="sc-line-item__price-text">
                <!-- redeemable UI -->
                <div class="sc-line-item__price-description" data-wp-bind--hidden="!state.discountIsRedeemable">
                    <span
                        class="coupon-human-discount"
                        data-wp-text="state.checkout.human_discount_with_duration"
                    ></span>
                </div>
                <div class="sc-line-item__price" data-wp-bind--hidden="!state.discountIsRedeemable" data-wp-text="state.checkout.display_discount_amount"></div>

                <!-- non-redeemable UI -->
                <div class="sc-line-item__price-description" data-wp-bind--hidden="state.discountIsRedeemable">
                    <div class="coupon__status">
                        <?php echo wp_kses( SureCart::svg()->get('alert-triangle', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
                        <span data-wp-text="state.checkout.discount.redeemable_status"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Discount Button and Form UI -->
    <div
        class="sc-coupon-form"
        data-wp-bind--hidden="state.isDiscountAdded"
    >
        <div style="margin-top: var(--sc-spacing-small, 10px);">
            <?php if ( $attributes['collapsed'] ): ?>
                <div>
                    <span
                        data-wp-bind--hidden="context.discountInputOpen"
                        hidden
                        class="trigger"
                        data-wp-on--click="surecart/checkout::actions.toggleDiscountInput"
                    >
                        <?php esc_html_e( $attributes['text'] ); ?>
                    </span>

                    <form>
                        <div
                            data-wp-bind--hidden="!context.discountInputOpen"
                            hidden
                            class="sc-input-group sc-coupon-form__input-group"
                        >
                            <input
                                type="text"
                                id="coupon"
                                class="sc-form-control sc-coupon-form__input"
                                aria-label="quantity"
                                aria-describedby="coupon-input-addon"
                                placeholder="<?php esc_html_e( 'Enter coupon code', 'surecart' ); ?>"
                                data-wp-bind="state.discountCode"
                                data-wp-on--input="actions.setDiscountCode"
                            >
                            <span class="sc-input-group-text" id="coupon-input-addon">
                                <button
                                    type="submit"
                                    data-wp-bind--hidden="!state.isDiscountCodeSet"
                                    data-wp-on--click="actions.applyDiscount"
                                >
                                    <?php esc_html_e( 'Apply', 'surecart' ); ?>
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            <?php else: ?>
                <div
                >
                    <label class="sc-form-label" for="sc-coupon-input">
                        <?php esc_html_e( $attributes['text'] ); ?>
                    </label>

                    <div class="sc-input-group sc-coupon-form__input-group">
                        <input
                            type="text"
                            id="sc-coupon-input"
                            class="sc-form-control sc-coupon-form__input"
                            aria-label="quantity"
                            aria-describedby="basic-addon1"
                            placeholder="<?php esc_html_e( 'Enter coupon code', 'surecart' ); ?>"
                            data-wp-bind="state.discountCode"
                            data-wp-on--input="actions.setDiscountCode"
                        >
                        <span class="sc-input-group-text" id="basic-addon1">
                            <button
                                data-wp-bind--hidden="!state.isDiscountCodeSet"
                                data-wp-on--click="actions.applyDiscount"
                            >
                                <?php esc_html_e( 'Apply', 'surecart' ); ?>
                            </button>
                        </span>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

export default `
<!-- wp:checkout-engine/price-selector -->
<ce-price-choices type="radio" columns="1"><div><!-- wp:checkout-engine/price-choice -->
<ce-price-choice type="radio" show-label="1" show-price="1" show-control="1"></ce-price-choice>
<!-- /wp:checkout-engine/price-choice --></div></ce-price-choices>
<!-- /wp:checkout-engine/price-selector -->

<!-- wp:checkout-engine/express-payment -->
<ce-express-payment class="wp-block-checkout-engine-express-payment">or</ce-express-payment>
<!-- /wp:checkout-engine/express-payment -->

<!-- wp:checkout-engine/email -->
<ce-input label="Email" autocomplete="false" inputmode="false" spellcheck="false" type="email" name="email" required class="wp-block-checkout-engine-email"></ce-input>
<!-- /wp:checkout-engine/email -->

<!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
<!-- /wp:checkout-engine/payment -->

<!-- wp:checkout-engine/totals {"collapsible":true,"collapsed":true} -->
<ce-order-summary collapsible="1" collapsed="1" class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
<ce-divider></ce-divider>
<!-- /wp:checkout-engine/divider -->

<!-- wp:checkout-engine/line-items -->
<ce-line-items removable="1" editable="1" class="wp-block-checkout-engine-line-items"></ce-line-items>
<!-- /wp:checkout-engine/line-items -->

<!-- wp:checkout-engine/divider -->
<ce-divider></ce-divider>
<!-- /wp:checkout-engine/divider -->

<!-- wp:checkout-engine/subtotal -->
<ce-line-item-total class="ce-subtotal" total="subtotal" class="wp-block-checkout-engine-subtotal"><span slot="description">Subtotal</span></ce-line-item-total>
<!-- /wp:checkout-engine/subtotal -->

<!-- wp:checkout-engine/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
<ce-coupon-form label="Add Coupon Code">Apply Coupon</ce-coupon-form>
<!-- /wp:checkout-engine/coupon -->

<!-- wp:checkout-engine/divider -->
<ce-divider></ce-divider>
<!-- /wp:checkout-engine/divider -->

<!-- wp:checkout-engine/total -->
<ce-line-item-total class="ce-line-item-total" total="total" size="large" show-currency="1" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
<!-- /wp:checkout-engine/total --></ce-order-summary>
<!-- /wp:checkout-engine/totals -->

<!-- wp:checkout-engine/submit {"full":true} -->
<ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit">Purchase</ce-button>
<!-- /wp:checkout-engine/submit -->`;

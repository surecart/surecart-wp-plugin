export default `<!-- wp:checkout-engine/section-title {"text":"Choose a Plan","description":""} -->
<ce-title style="--ce-font-size:var(--ce-text-x-large)">Choose a Plan</ce-title>
<!-- /wp:checkout-engine/section-title -->

<!-- wp:checkout-engine/price-selector -->
<ce-price-choices></ce-price-choices>
<!-- /wp:checkout-engine/price-selector -->

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:checkout-engine/section-title {"text":"Credit Card","description":""} -->
<ce-title style="--ce-font-size:var(--ce-text-x-large)">Credit Card</ce-title>
<!-- /wp:checkout-engine/section-title -->

<!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
<!-- /wp:checkout-engine/payment -->

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:checkout-engine/section-title {"text":"Contact Information"} -->
<ce-title style="--ce-font-size:var(--ce-text-x-large)">Contact Information</ce-title>
<!-- /wp:checkout-engine/section-title -->

<!-- wp:checkout-engine/name -->
<ce-input label="Name" help="Optional" autocomplete="false" inputmode="false" spellcheck="false" name="name" type="text" class="wp-block-checkout-engine-name"></ce-input>
<!-- /wp:checkout-engine/name -->

<!-- wp:checkout-engine/email -->
<ce-input label="Email" clearable="" disabled autofocus autocomplete="" name="email" placeholder="" readonly showlabel="" size="" spellcheck="" togglepassword="" type="email" required class="wp-block-checkout-engine-email"></ce-input>
<!-- /wp:checkout-engine/email -->

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:checkout-engine/section-title {"text":"Totals"} -->
<ce-title style="--ce-font-size:var(--ce-text-x-large)">Totals</ce-title>
<!-- /wp:checkout-engine/section-title -->

<!-- wp:checkout-engine/totals -->
<ce-order-summary class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
<ce-divider></ce-divider>
<!-- /wp:checkout-engine/divider -->

<!-- wp:checkout-engine/line-items -->
<ce-line-items class="wp-block-checkout-engine-line-items"></ce-line-items>
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
<ce-line-item-total class="ce-line-item-total" total="total" size="large" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
<!-- /wp:checkout-engine/total --></ce-order-summary>
<!-- /wp:checkout-engine/totals -->

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:checkout-engine/submit -->
<ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit">Purchase</ce-button>
<!-- /wp:checkout-engine/submit -->`;

export default `<!-- wp:checkout-engine/pricing-section /-->
<!-- wp:checkout-engine/form-section {"label":"Payment"} -->
<ce-form-section class="wp-block-checkout-engine-form-section"><span slot="label">Payment</span><!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
<ce-payment secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
<!-- /wp:checkout-engine/payment --></ce-form-section>
<!-- /wp:checkout-engine/form-section -->
<!-- wp:checkout-engine/form-section {"label":"Contact Information"} -->
<ce-form-section class="wp-block-checkout-engine-form-section"><span slot="label">Contact Information</span><!-- wp:checkout-engine/name -->
<ce-input label="Name" help="Optional" autocomplete="false" inputmode="false" spellcheck="false" name="name" type="text" class="wp-block-checkout-engine-name"></ce-input>
<!-- /wp:checkout-engine/name -->
<!-- wp:checkout-engine/email -->
<ce-input label="Email" autocomplete="false" inputmode="false" spellcheck="false" name="email" type="email" required class="wp-block-checkout-engine-email"></ce-input>
<!-- /wp:checkout-engine/email --></ce-form-section>
<!-- /wp:checkout-engine/form-section -->
<!-- wp:checkout-engine/form-section {"label":"Totals"} -->
<ce-form-section class="wp-block-checkout-engine-form-section"><span slot="label">Totals</span><!-- wp:checkout-engine/totals /--></ce-form-section>
<!-- /wp:checkout-engine/form-section -->
<!-- wp:checkout-engine/submit /-->`;

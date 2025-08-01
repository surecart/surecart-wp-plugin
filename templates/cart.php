<?php
/**
 * Cart page block template.
 */
return [
	'title'      => __( 'Cart', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/slide-out-cart {"width":"525px","style":{"color":{"background":"#ffffff"},"typography":{"fontSize":"15px"},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5em","bottom":"0em","left":"2em","right":"2em"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group" style="padding-top:1.5em;padding-right:2em;padding-bottom:0em;padding-left:2em">
	<!-- wp:surecart/cart-close-button {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"lineHeight":"1"}}} /-->

	<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px","lineHeight":"1","fontStyle":"normal","fontWeight":"500"},"spacing":{"padding":{"top":"0px","bottom":"0px","left":"0px","right":"0px"},"margin":{"top":"0px","bottom":"0px","left":"0px","right":"0px"}},"color":{"text":"#4b5563"},"elements":{"link":{"color":{"text":"#4b5563"}}}}} -->
	<p class="has-text-color has-link-color"
		style="color:#4b5563;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;font-size:16px;font-style:normal;font-weight:500;line-height:1">
		Review My Order</p>
	<!-- /wp:paragraph -->

	<!-- wp:surecart/cart-count {"style":{"layout":{"selfStretch":"fit","flexSize":null},"typography":{"lineHeight":"1","fontWeight":"600","fontSize":"14px","fontStyle":"normal"},"spacing":{"padding":{"top":"6px","bottom":"6px","left":"10px","right":"10px"}},"color":{"background":"#f3f4f6"},"border":{"radius":"4px"}}} /-->
</div>
<!-- /wp:group -->

<!-- wp:surecart/slide-out-cart-line-items {"border":false,"padding":{"top":"0em","right":"0em","bottom":"0em","left":"0em"},"metadata":{"ignoredHookedBlocks":["surecart/cart-line-item-divider"]},"style":{"spacing":{"padding":{"top":"2em","bottom":"2em","left":"2em","right":"2em"},"blockGap":"2em"}}} -->
<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"dimensions":{"minHeight":""}},"layout":{"type":"default"}} -->
<div class="wp-block-group">
	<!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"stretch"}} -->
	<div class="wp-block-group">
		<!-- wp:surecart/cart-line-item-image {"aspectRatio":"1","width":"","height":"","style":{"layout":{"selfStretch":"fixed","flexSize":"80px"},"border":{"color":"#dce0e6","width":"1px","radius":"4px"},"color":{"duotone":"unset"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} /-->

		<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"blockGap":"5px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap","verticalAlignment":"top"}} -->
		<div class="wp-block-group">
			<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"stretch","justifyContent":"space-between"}} -->
			<div class="wp-block-group">
				<!-- wp:group {"style":{"layout":{"selfStretch":"fixed","flexSize":"50%"},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
				<div class="wp-block-group">
					<!-- wp:surecart/cart-line-item-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","lineHeight":"1.4","textDecoration":"none"},"color":{"text":"#4b5563"},"elements":{"link":{"color":{"text":"#4b5563"}}}}} /-->

					<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
					<div class="wp-block-group">
						<!-- wp:surecart/cart-line-item-price-name {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->

						<!-- wp:surecart/cart-line-item-variant {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->

						<!-- wp:surecart/cart-line-item-note {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->
					</div>
					<!-- /wp:group -->

					<!-- wp:surecart/cart-line-item-status {"style":{"typography":{"textAlign":"right"},"elements":{"link":{"color":{"text":"var:preset|color|vivid-red"}}}},"textColor":"vivid-red"} /-->
				</div>
				<!-- /wp:group -->

				<!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
				<div class="wp-block-group">
					<!-- wp:group {"style":{"spacing":{"blockGap":"4px"},"typography":{"lineHeight":"1.4"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"right"}} -->
					<div class="wp-block-group" style="line-height:1.4">
						<!-- wp:surecart/cart-line-item-scratch-amount {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}}}} /-->

						<!-- wp:surecart/cart-line-item-amount {"style":{"color":{"text":"#4b5563"},"elements":{"link":{"color":{"text":"#4b5563"}}},"typography":{"fontStyle":"normal","fontWeight":"500","textAlign":"right"}}} /-->

						<!-- wp:surecart/cart-line-item-interval {"style":{"typography":{"fontSize":"14px"},"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}}}} /-->
					</div>
					<!-- /wp:group -->

					<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
					<div class="wp-block-group">
						<!-- wp:surecart/cart-line-item-trial {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","textAlign":"right"}}} /-->

						<!-- wp:surecart/cart-line-item-fees {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","textAlign":"right"}}} /-->
					</div>
					<!-- /wp:group -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->

			<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
			<div class="wp-block-group">
				<!-- wp:group {"style":{"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"default"}} -->
				<div class="wp-block-group"><!-- wp:surecart/cart-line-item-quantity /--></div>
				<!-- /wp:group -->

				<!-- wp:group {"style":{"layout":{"selfStretch":"fit","flexSize":null},"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right"}} -->
				<div class="wp-block-group">
					<!-- wp:surecart/cart-line-item-remove {"style":{"typography":{"fontSize":"14px","fontStyle":"normal","fontWeight":"400"},"elements":{"link":{"color":{"text":"#6b7280"}}},"color":{"text":"#6b7280"}}} /-->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
<!-- /wp:surecart/slide-out-cart-line-items -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"2em","bottom":"2em","left":"2em","right":"2em"}},"border":{"top":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group"
	style="border-top-color:#e5e7eb;border-top-width:1px;padding-top:2em;padding-right:2em;padding-bottom:2em;padding-left:2em">
	<!-- wp:surecart/slide-out-cart-items-subtotal {"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap","verticalAlignment":"top"}} -->
	<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"default"}} -->
	<div class="wp-block-group">
		<!-- wp:paragraph {"style":{"color":{"text":"#4b5563"},"typography":{"fontStyle":"normal","fontWeight":"500","fontSize":"18px","lineHeight":"1.4"},"spacing":{"margin":{"top":"0px","bottom":"0px"}}}} -->
		<p class="has-text-color"
			style="color:#4b5563;margin-top:0px;margin-bottom:0px;font-size:18px;font-style:normal;font-weight:500;line-height:1.4">
			Subtotal</p>
		<!-- /wp:paragraph -->

		<!-- wp:paragraph {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"},"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}}}} -->
		<p class="has-text-color has-link-color" style="color:#828c99;font-size:14px;line-height:1.4">Taxes &amp;
			shipping calculated at
			checkout</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:surecart/cart-subtotal-amount {"style":{"typography":{"fontSize":"18px","fontStyle":"normal","fontWeight":"500","lineHeight":"1.4"},"color":{"text":"#4b5563"},"elements":{"link":{"color":{"text":"#4b5563"}}}}} /-->
	<!-- /wp:surecart/slide-out-cart-items-subtotal -->

	<!-- wp:surecart/slide-out-cart-items-submit {"style":{"border":{"radius":"4px"}}} /-->
</div>
<!-- /wp:group -->
<!-- /wp:surecart/slide-out-cart -->',
];

<?php
$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';

wp_interactivity_state(
	"surecart/checkout",
	array(
        'discountInputOpen' => false,
        'discountCode' => '',
        'loading' => false,
        'openCartSidebar' => false,
        'checkout' => null,

        // derived states.
        'discountIsRedeemable' => false,
        'isDiscountAdded' => false,
        'isDiscountCodeSet' => false,
        'hasBumpAmount' => false,
	)
);

$form = \SureCart::forms()->getDefault();

return 'file:./view.php';

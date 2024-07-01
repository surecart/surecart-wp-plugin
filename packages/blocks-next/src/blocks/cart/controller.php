<?php
$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = $styles['classnames'] ?? '';

$form      = \SureCart::forms()->getDefault();
$form_mode = \SureCart\Models\Form::getMode( $form->ID );

wp_interactivity_state(
	'surecart/checkout',
	array(
		'discountInputOpen'    => false,
		'discountCode'         => '',
		'loading'              => true,
		'checkout'             => null,

		// derived states.
		'discountIsRedeemable' => false,
		'isDiscountAdded'      => false,
		'isPromotionCodeSet'    => false,
		'hasBumpAmount'        => false,
	)
);

return 'file:./view.php';

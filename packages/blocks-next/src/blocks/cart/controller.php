<?php
$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = $styles['classnames'] ?? '';

$form      = \SureCart::forms()->getDefault();
$form_mode = \SureCart\Models\Form::getMode( $form->ID );

wp_interactivity_state(
	'surecart/checkout',
	array(
		// derived states.
		'discountIsRedeemable' => false,
		'isDiscountApplied'    => false,
		'itemsCount'           => 0,
		'hasItems'             => false,
	)
);

return 'file:./view.php';

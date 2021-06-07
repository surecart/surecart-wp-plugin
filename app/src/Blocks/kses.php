<?php
/**
 * KSES for our web components
 *
 * @package CheckoutEngine
 */

return [
	'ce-form-section' => [
		'label' => true,
		'slot'  => true,
	],
	'ce-form-row'     => [
		'slot' => true,
	],
	'ce-choices'      => [
		'tabindex' => true,
		'slot'     => true,
	],
	'ce-choice'       => [
		'name'     => true,
		'required' => true,
		'checked'  => true,
		'slot'     => true,
	],
];

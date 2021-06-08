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
	'ce-input'        => [
		'name'            => true,
		'type'            => true,
		'size'            => true,
		'help'            => true,
		'show-label'      => true,
		'value'           => true,
		'pill'            => true,
		'clearable'       => true,
		'toggle-password' => true,
		'disabled'        => true,
		'readonly'        => true,
		'minlength'       => true,
		'maxlength'       => true,
		'min'             => true,
		'max'             => true,
		'step'            => true,
		'pattern'         => true,
		'autocorrect'     => true,
		'autofocus'       => true,
		'spellcheck'      => true,
		'inputmode'       => true,
		'label'           => true,
		'placeholder'     => true,
		'required'        => true,
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

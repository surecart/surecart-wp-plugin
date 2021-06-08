<ce-form-row>
	@component('blocks.input', [
	'type' => 'email',
	'label' => $label ?? '',
	'placeholder' => $placeholder ?? '',
	'required' => $required ?? ''
	])@endcomponent
</ce-form-row>

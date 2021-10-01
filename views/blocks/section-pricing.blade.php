 <ce-form-row>
	@component('components.prices', [
		'label' => $label ?? __('Choose a price'),
		'type' => $type ?? 'radio',
		'columns' => $columns ?? 1,
		])
	@endcomponent
</ce-form-row>

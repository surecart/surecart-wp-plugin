@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])

    <ce-form-row>
        @component('components.prices', [
			'type' => $type ?? 'radio',
            'prices' => $prices ?? [],
        ])
        @endcomponent
    </ce-form-row>

@endcomponent

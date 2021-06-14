@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])

    <ce-form-row>
        @component('components.prices', [
            'default' => 'dd514523-297b-4a86-b5ff-6db0a70d7e17',
            'type' => $type ?? 'radio',
            'columns' => $columns ?? 1,
            ])
        @endcomponent
    </ce-form-row>

@endcomponent

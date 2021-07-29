@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])

    <ce-form-row>
        @component('components.prices', [
            'default' => 'dd514523-297b-4a86-b5ff-6db0a70d7e17',
            'type' => $type ?? 'radio',
            'columns' => $columns ?? 1,
            'price_ids' => ['6b6f10b8-1054-455b-83e5-86be0e6fa74e', 'b20c81ce-0fd8-4ef6-8a1d-870691906682'],
            ])
        @endcomponent
    </ce-form-row>

@endcomponent

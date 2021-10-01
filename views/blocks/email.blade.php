<ce-form-row>
    @component('blocks.input', [
        'name' => 'email',
        'label' => $label ?? '',
        'autocomplete',
        ])
    @endcomponent
</ce-form-row>

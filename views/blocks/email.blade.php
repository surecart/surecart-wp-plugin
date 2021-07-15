<ce-form-row>
    @component('blocks.input', [
        'type' => 'email',
        'name' => 'email',
        'label' => $label ?? '',
        'placeholder' => $placeholder ?? '',
        'required' => $required ?? true,
    ])@endcomponent
</ce-form-row>

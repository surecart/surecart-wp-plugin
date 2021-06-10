<ce-form-row>
    @component('blocks.input', [
        'type' => 'email',
        'label' => $label ?? '',
        'placeholder' => $placeholder ?? '',
        'required' => $required ?? true,
    ])@endcomponent
</ce-form-row>

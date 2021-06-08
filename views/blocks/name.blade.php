<ce-form-row>
    @component('blocks.input', [
        'name' => 'first_name',
        'label' => 'First Name',
        'help' => 'Optional',
        ])
    @endcomponent

    @component('blocks.input', [
        'name' => 'last_name',
        'label' => 'Last Name',
        'help' => 'Optional',
        ])
    @endcomponent
</ce-form-row>

@component('components.form-section', [
    'label' => $label ?? '',
    ])

    @if (!empty($description))
        <ce-secure-notice slot="description">
            <?php echo wp_kses_post($description); ?>
        </ce-secure-notice>
    @endif

    <ce-payment></ce-payment>

@endcomponent

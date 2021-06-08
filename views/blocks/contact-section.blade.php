@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])

    <?php echo wp_kses_post($content); ?>

@endcomponent

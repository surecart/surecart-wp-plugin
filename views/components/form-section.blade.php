<ce-form-section>
    @if (!empty($label))
        <span slot="label"><?php echo wp_kses_post($label); ?></span>
    @endif

    @if (!empty($description))
        <span slot="description"><?php echo wp_kses_post($description); ?></span>
    @endif

    {{ $slot }}
</ce-form-section>

<ce-form-row>
    <ce-input name="email" type="email" label="<?php echo esc_attr($label ?? ''); ?>"
        placeholder="<?php echo esc_attr($placeholder ?? ''); ?>" @if (!empty($required)) required @endif></ce-input>
</ce-form-row>

<ce-form-row>
    <ce-email label="<?php echo esc_attr($label ?? ''); ?>"
        help="<?php echo esc_attr($help ?? ''); ?>"
        size="<?php echo esc_attr($size ?? 'medium'); ?>"
        placeholder="<?php echo esc_attr($placeholder ?? ''); ?>"
        required
        {{ !empty($pill) ? 'pill' : '' }}
        {{ !empty($clearable) ? 'clearable' : '' }}
        {{ !empty($disabled) ? 'disabled' : '' }}
        {{ !empty($autofocus) ? 'autofocus' : '' }}
        {{ !empty($autocomplete) ? 'autocomplete' : '' }}></ce-email>
</ce-form-row>

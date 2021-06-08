<ce-input name="<?php echo esc_attr($name ?? ''); ?>" @isset($label)
    label="<?php echo esc_attr($label); ?>" @endisset
    type="<?php echo esc_attr($type ?? 'text'); ?>" @isset($size)
        size="<?php echo esc_attr($size); ?>" @endisset @isset($help)
        help="<?php echo esc_attr($help); ?>" @endisset @isset($placeholder)
        placeholder="<?php echo esc_attr($placeholder); ?>" @endisset @if (!empty($required)) required @endif></ce-input>

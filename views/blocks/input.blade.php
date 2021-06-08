<ce-input name="<?php echo esc_attr($name ?? ''); ?>"
    label="<?php echo esc_attr($label ?? ''); ?>"
    type="<?php echo esc_attr($type ?? 'text'); ?>"
    help="<?php echo esc_attr($help ?? ''); ?>"
    size="<?php echo esc_attr($size ?? 'medium'); ?>"
    placeholder="<?php echo esc_attr($placeholder ?? ''); ?>"
    inputmode="<?php echo esc_attr($inputmode ?? 'text'); ?>"
    pattern="<?php echo esc_attr($pattern ?? ''); ?>"
    {{ !empty($required) ? 'required' : '' }}
    {{ !empty($pill) ? 'pill' : '' }}
    {{ !empty($clearable) ? 'clearable' : '' }}
    {{ !empty($toggle_password) ? 'toggle-password' : '' }}
    {{ !empty($disabled) ? 'disabled' : '' }}
    {{ !empty($spellcheck) ? 'spellcheck' : '' }}
    {{ !empty($autofocus) ? 'autofocus' : '' }}
    {{ !empty($autocomplete) ? 'autocomplete' : '' }}
    {{ !empty($autocorrect) ? 'autocorrect' : '' }}></ce-input>

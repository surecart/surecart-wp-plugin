<ce-button type={{ $type ?? 'primary' }}
    size={{ $size ?? 'large' }}
    value={{ $value ?? '' }}
    href={{ $href ?? '' }}
    {{ !empty($full) ? 'full' : '' }}
    {{ !empty($caret) ? 'caret' : '' }}
    {{ !empty($disabled) ? 'disabled' : '' }}
    {{ !empty($submit) ? 'submit' : '' }}>
    <?php echo wp_kses_post($text); ?>
</ce-button>

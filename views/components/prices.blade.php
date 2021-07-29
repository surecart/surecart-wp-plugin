<ce-price-choices default="{{ $default ?? '' }}"
    type="{{ $type ?? '' }}"
    columns="{{ $columns ?? 1 }}"
    price-ids="<?php echo esc_attr(wp_json_encode($price_ids)); ?>">
</ce-price-choices>

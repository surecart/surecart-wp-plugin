<?php
$block_id = $block->context["surecart/product-list/blockId"] ?? '';
$sort_key = isset( $block_id ) ? 'products-' . $block_id . '-sort' : 'products-sort';
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );
?>

<select class="sc-dropdown" data-wp-on--input="surecart/product-list::actions.sort">
    <option value="created_at:desc" <?php selected($sort, 'created_at:desc'); ?>> <?php esc_html_e('Latest', 'surecart') ?> </option>
    <option value="created_at:asc" <?php selected($sort, 'created_at:asc'); ?>> <?php esc_html_e('Oldest', 'surecart') ?> </option>
    <option value="name:asc" <?php selected($sort, 'name:asc'); ?>> <?php esc_html_e('Alphabetical, A-Z', 'surecart') ?> </option>
    <option value="name:desc" <?php selected($sort, 'name:desc'); ?>> <?php esc_html_e('Alphabetical, Z-A', 'surecart') ?> </option>
</select>
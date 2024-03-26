<?php
$block_id = $block->context["surecart/product-list/blockId"] ?? '';
?>

<select class="sc-dropdown" data-wp-on--input="surecart/product-list::actions.sort">
    <option value="created_at:desc"> <?php esc_html_e('Latest', 'surecart') ?> </option>
    <option value="created_at:asc"> <?php esc_html_e('Oldest', 'surecart') ?> </option>
    <option value="name:asc"> <?php esc_html_e('Alphabetical, A-Z', 'surecart') ?> </option>
    <option value="name:desc"> <?php esc_html_e('Alphabetical, Z-A', 'surecart') ?> </option>
</select>
<?php
$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$search_key = isset( $block_id ) ? 'products-' . $block_id . '-search' : 'products-search';
$search = empty( $_GET[ $search_key ] ) ? '' : sanitize_text_field( $_GET[ $search_key ] );
?>
<div 
    <?php echo get_block_wrapper_attributes( array( 'class' => "sc-input-group sc-input-group-sm" ) ); ?>
>
    <span class="sc-input-group-text">
        <?php echo SureCart::svg()->get( 'search', [ 'width' => 16, 'height' => 16, 'class' => 'sc-icon' ] ); ?>
    </span>
    <input
        class="sc-form-control"
        type="search"
        data-wp-on--keyup="actions.onSearchInput"
        data-wp-on--search="actions.onSearchClear"
        placeholder="<?php echo __( 'Search', 'surecart' ) ; ?>"
        value="<?php echo esc_attr( $search ); ?>"
    >
</div>

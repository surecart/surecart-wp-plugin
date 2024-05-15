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
        data-wp-on--input="actions.onSearchInput"
        placeholder="<?php echo __( 'Search', 'surecart' ) ; ?>"
        value="<?php echo esc_attr( $search ); ?>"
    >
    <span class="sc-input-group-text" data-wp-style--visibility="state.searchLoadingVisibility">
        <span class="sc-spinner" aria-hidden="true"></span>
    </span>
</div>

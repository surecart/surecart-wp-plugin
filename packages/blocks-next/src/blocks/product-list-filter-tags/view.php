<?php
use SureCart\Models\ProductCollection;

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : array_map('sanitize_text_field', $_GET[ $filter_key ]);

if ( empty( $filter ) ) {
    return;
}

$product_collections  = ProductCollection::where([
    'ids' => $filter,
])->get( array( 'per_page' => -1 ) );
?>

<div
    <?php echo get_block_wrapper_attributes( array( 'class' => $class . 'is-layout-flex is-wrap' ) ); ?> 
    style="<?php 
		echo 'flex-direction: row;';
	?>"
>
	<?php foreach ( $product_collections as $product_collection ) : 
        $remove_filter_url = esc_url( add_query_arg( $filter_key, array_diff( $filter, [ $product_collection->id ] ) ) );
        
        ?>
        <a 
            key="<?php echo esc_attr( $product_collection->id ); ?>" 
            id="<?php echo esc_attr( $product_collection->id ); ?>" 
            class="sc-tag sc-tag--default sc-tag--medium sc-tag--clearable"
            href="<?php echo esc_url( $remove_filter_url ); ?>"
            data-wp-on--click="surecart/product-list::actions.navigate"
            data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
            data-wp-watch="surecart/product-list::callbacks.prefetch" 
            style="<?php echo 'cursor: pointer; text-decoration: none;'; ?>"
        >
            <span class="tag__content">
                <?php echo esc_html( $product_collection->name ); ?>
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x"
                viewBox="0 0 16 16"
            >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
            </svg>
        </a>
    <?php endforeach; ?>	
</div>

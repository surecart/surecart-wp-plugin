<?php
use SureCart\Models\ProductCollection;

$block_id = $block->context["surecart/product-list/blockId"];
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : sanitize_text_field( $_GET[ $filter_key ] );
$collection_ids = $filter ? explode( ',', $filter ) : [];

if ( empty( $collection_ids ) ) {
    return;
}

$product_collections  = ProductCollection::where([
    'ids' => $collection_ids,
])->get( array( 'per_page' => -1 ) );


$block_gap_css_var = $attributes['style']['spacing']['blockGap'] ? sc_get_block_gap_css_var( $attributes['style']['spacing']['blockGap'] ) : '0.75em';

?>

<div
    <?php echo get_block_wrapper_attributes( array( 'class' => $class . 'is-layout-flex is-wrap' ) ); ?> 
    style="<?php 
		echo 'flex-direction: row;';
		echo 'gap:' . $block_gap_css_var . '; ';  
		echo esc_attr($style); 
	?>"
>
	<?php foreach ( $product_collections as $product_collection ) : ?>
        <button class="sc-tag sc-tag--primary tag--clearable">
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
        </button>
    <?php endforeach; ?>	
</div>

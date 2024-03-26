<select
    <?php echo get_block_wrapper_attributes( array( 'class' => $class . ' sc-dropdown' ) ); ?> 
    style="<?php echo esc_attr( $style ); ?>" 
    data-wp-on--input="surecart/product-list::actions.filter"
>
    <option value=""><?php esc_html_e( 'Filter', 'surecart' ); ?></option>
    <?php foreach ( $product_collections as $collection ) : ?>
        <option value="<?php echo esc_attr( $collection->id ); ?>">
            <?php echo esc_html( $collection->name ); ?>
        </option>
    <?php endforeach; ?>
</select>
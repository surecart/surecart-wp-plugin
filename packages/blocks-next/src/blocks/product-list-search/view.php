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
        placeholder="<?php echo $attributes['placeholder'] ? esc_attr( $attributes['placeholder'] ) : __( 'Search', 'surecart' ) ; ?>"
    >
</div>

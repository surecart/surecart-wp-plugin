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

	<?php if ( ! empty( $search ) ) : ?>
		<span class="sc-input-group-text"
			role="button"
			tabindex="0"
			data-wp-bind--hidden="state.searching"
			data-wp-on--click="actions.clearSearch"
			data-wp-on--keydown="actions.clearSearch"
		>
			<?php echo SureCart::svg()->get( 'x', [ 'width' => 16, 'height' => 16, 'class' => 'sc-icon', 'aria-hidden' => true ] ); ?>
			<div class="sc-screen-reader-text"><?php esc_html_e( 'Clear search', 'surecart' ); ?></div>
		</span>
	<?php endif; ?>

    <span class="sc-input-group-text" data-wp-bind--hidden="!state.searching" hidden>
        <span class="sc-spinner" aria-hidden="true"></span>
    </span>
</div>

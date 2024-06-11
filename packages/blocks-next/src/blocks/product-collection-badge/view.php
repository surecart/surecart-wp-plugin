<a
	data-wp-bind--key="context.collection.id"
	data-wp-bind--id="context.collection.id"
	data-wp-bind--href="context.collection.permalink"
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-product-collection-badge' ) ) ); ?>
>
	<span aria-hidden="true" data-wp-text="context.collection.name"></span>
	<span class="sc-screen-reader-text" data-wp-text="context.collection.screen_reader_text"></span>
</a>

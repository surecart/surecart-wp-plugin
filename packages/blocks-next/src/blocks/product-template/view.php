<?php

if ( ! $query->have_posts() ) {
	return '';
}

// $wrapper_attributes = get_block_wrapper_attributes();

$content = '';
while ( $query->have_posts() ) :
	$query->the_post();

	// Get an instance of the current Post Template block.
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	$post_id              = get_the_ID();
	$post_type            = get_post_type();
	$filter_block_context = static function ( $context ) use ( $post_id, $post_type ) {
		$context['postType'] = $post_type;
		$context['postId']   = $post_id;
		return $context;
	};

	// Use an early priority to so that other 'render_block_context' filters have access to the values.
	add_filter( 'render_block_context', $filter_block_context, 1 );
	// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
	remove_filter( 'render_block_context', $filter_block_context, 1 );

	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );

	?>
	<div data-wp-key="post-template-item-<?php echo (int) $post_id; ?>">
		<?php echo $block_content; ?>
	</div>
	<?php
endwhile;

/*
* Use this function to restore the context of the template tags
* from a secondary query loop back to the main query loop.
* Since we use two custom loops, it's safest to always restore.
*/
wp_reset_postdata();


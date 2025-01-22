<?php global $sc_query_id; ?>
<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'role'             => 'list',
				'aria-describedby' => 'filter-checkboxes-label-' . $block->context['taxonomySlug'] . '-' . $sc_query_id,
			]
		)
	);
	?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'collections' => $options ] ) ); ?>
>
<?php
foreach ( $options as $checkbox ) :
	// Get an instance of the current Post Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

		$filter_block_context = static function ( $context ) use ( $checkbox ) {
			$context['surecart/checkbox'] = $checkbox;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );

		remove_filter( 'render_block_context', $filter_block_context, 1 );
	?>
	<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
<?php endforeach; ?>
</div>

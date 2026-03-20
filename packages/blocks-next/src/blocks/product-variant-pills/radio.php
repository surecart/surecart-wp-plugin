<?php
// Get highlight styles from the inner product-variant-pill block.
$pill_block       = wp_get_first_block( $block->parsed_block['innerBlocks'], 'surecart/product-variant-pill' );
$pill_block_attrs = $pill_block['attrs'] ?? [];
?>

<label class="sc-form-label">
	<?php echo wp_kses_post( $option->name ); ?>
</label>

<div
<?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		[
			'class' => 'sc-pill-option__wrapper',
			'style' => sc_get_inline_styles(
				array_filter(
					[
						'--sc-pill-option-active-background-color' => $pill_block_attrs['highlight_background'] ?? '',
						'--sc-pill-option-active-text-color'       => $pill_block_attrs['highlight_text'] ?? '',
						'--sc-pill-option-active-border-color'     => $pill_block_attrs['highlight_border'] ?? '',
					]
				)
			),
		]
	)
);
?>
>
	<?php
	foreach ( $option->values as $value ) :
		// Get an instance of the current Post Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

		$filter_block_context = static function ( $context ) use ( $value, $option ) {
			$context['value'] = $value;
			$context['name']  = $option->name;
			return $context;
		};

		// Use an early priority to so that other 'render_block_context' filters have access to the values.
		add_filter( 'render_block_context', $filter_block_context, 1 );
		// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
		// `render_callback` and ensure that no wrapper markup is included.
		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );
		?>
		<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endforeach; ?>
</div>

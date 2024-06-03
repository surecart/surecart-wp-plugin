<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<div class="sc-product-variants__wrapper">
	<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
		<div
			<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'optionNumber' => (int) $key + 1 ] ) ); ?>
			<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
		>
			<label class="sc-form-label">
				<?php echo wp_kses_post( $option->name ); ?>
			</label>

			<div <?php echo wp_interactivity_data_wp_context( array( 'optionValues' => $option->values ) ); ?> >
				<?php echo $content; ?>
			</div>
		</div>
	<?php endforeach; ?>
</div>

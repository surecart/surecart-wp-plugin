<?php
/**
 * PHP file to use when rendering the product collection badges block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *   $attributes (array): The block attributes.
 *   $content (string): The block content.
 *   $collections (array): The product collections.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'is-layout-flex sc-product-collection-badges' ) ) ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'collections' => $collections ) ) ); ?>
>
	<template
		data-wp-each--collection="context.collections"
	>
		<span data-wp-key="context.collection.id">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</span>
	</template>
</div>


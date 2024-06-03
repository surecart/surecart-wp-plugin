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
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-pill-option__wrapper' ) ) ); ?>
>
	<template
		data-wp-each--option_value="context.optionValues"
	>
		<div data-wp-key="context.option_value" >
			<?php echo $content; ?>
		</div>
	</template>
</div>

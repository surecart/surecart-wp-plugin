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

printf(
	'<style>button.sc-pill-option__button--selected,button.sc-pill-option__button--selected:hover,button.sc-pill-option__button--selected:focus{background-color:%s!important;color:%s!important;border-color:%s!important;}</style>',
	$attributes['highlight_background'] ?? '',
	$attributes['highlight_text'] ?? '',
	$attributes['highlight_border'] ?? ''
);

?>
<button
	type="button"
	data-wp-bind--value="context.option_value"
	data-wp-text="context.option_value"
	data-wp-on--click="callbacks.setOption"
	data-wp-class--sc-pill-option__button--selected="state.isOptionSelected"
	data-wp-class--sc-pill-option__button--disabled="state.isOptionUnavailable"
	data-wp-bind--aria-checked="state.isOptionSelected"
	data-wp-bind--aria-disabled="state.isOptionUnavailable"
	tabindex="0"
	role="radio"
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-pill-option__button' ) ) ); ?>
>
</button>

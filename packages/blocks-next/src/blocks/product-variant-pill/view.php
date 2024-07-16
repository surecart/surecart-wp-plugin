<?php
printf(
	'<style>button.sc-pill-option__button--selected,button.sc-pill-option__button--selected:hover,button.sc-pill-option__button--selected:focus{background-color:%s!important;color:%s!important;border-color:%s!important;}</style>',
	esc_attr( $attributes['highlight_background'] ?? '' ),
	esc_attr( $attributes['highlight_text'] ?? '' ),
	esc_attr( $attributes['highlight_border'] ?? '' )
);
?>

<button
<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-pill-option__button' ) ) ); ?>
<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'option_value' => $block->context['value'] ) ) ); ?>
type="button"
data-wp-on--click="callbacks.setOption"
data-wp-class--sc-pill-option__button--selected="state.isOptionSelected"
data-wp-class--sc-pill-option__button--disabled="state.isOptionUnavailable"
data-wp-bind--aria-checked="state.isOptionSelected"
data-wp-bind--aria-disabled="state.isOptionUnavailable"
role="radio"
>
	<span class="sc-screen-reader-text"><?php printf( esc_html__( 'Select %s', 'surecart' ), $block->context['name'] ); ?> </span>
	<?php echo esc_html( $block->context['value'] ); ?>
</button>

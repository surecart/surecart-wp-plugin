<?php
$has_saved_inner = ! empty( $block->parsed_block['innerBlocks'] );

$inner_blocks = $has_saved_inner
	? $block->parsed_block['innerBlocks']
	: array(
		array(
			'blockName'    => 'surecart/bundle-item-variant-pill',
			'attrs'        => array(),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		),
	);

$inner_content = $has_saved_inner
	? ( $block->parsed_block['innerContent'] ?? array( null ) )
	: array( null );

$pill_block       = wp_get_first_block( $inner_blocks, 'surecart/bundle-item-variant-pill' );
$pill_block_attrs = $pill_block['attrs'] ?? array();

$inline_styles = sc_get_inline_styles(
	array_filter(
		array(
			'--sc-pill-option-active-background-color' => $pill_block_attrs['highlight_background'] ?? '',
			'--sc-pill-option-active-text-color'       => $pill_block_attrs['highlight_text'] ?? '',
			'--sc-pill-option-active-border-color'     => $pill_block_attrs['highlight_border'] ?? '',
		)
	)
);
?>
<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-pill-option__wrapper',
				'style' => $inline_styles,
			)
		)
	);
	?>
	role="radiogroup"
	aria-label="<?php echo esc_attr( $current_option->name ); ?>"
>
	<?php
	foreach ( $current_option->values as $value ) :
		$pill_instance                 = $block->parsed_block;
		$pill_instance['blockName']    = 'core/null';
		$pill_instance['innerBlocks']  = $inner_blocks;
		$pill_instance['innerContent'] = $inner_content;

		$filter_block_context = static function ( $context ) use ( $value, $current_option ) {
			$context['value'] = $value;
			$context['name']  = $current_option->name;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );
		$pill_content = ( new WP_Block( $pill_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );

		echo $pill_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	endforeach;
	?>
</div>

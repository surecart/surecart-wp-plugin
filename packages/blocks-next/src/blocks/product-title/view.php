<?php $tag = 'h' . (int) ( $attributes['level'] ?? 1 ); ?>
<<?php echo esc_html( $tag ); ?> <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( $is_link ) : ?>
		<a
			data-wp-bind--href="context.product.permalink"
			target="<?php echo esc_attr( $attributes['linkTarget'] ); ?>"
			<?php ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : ''; ?>
			data-wp-bind--title="context.product.name"
		>
	<?php endif; ?>

	<span data-wp-text="context.product.name"></span>

	<?php if ( $is_link ) : ?>
		</a>
	<?php endif; ?>
</<?php echo esc_html( $tag ); ?>>

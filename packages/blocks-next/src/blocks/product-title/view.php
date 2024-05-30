<?php $html_tag = 'h' . (int) ( $attributes['level'] ?? 1 ); ?>
<<?php echo esc_html( $html_tag ); ?> <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( $is_link ) : ?>
		<a
			data-wp-bind--href="context.product.permalink"
			target="<?php echo esc_attr( $attributes['linkTarget'] ); ?>"
			<?php echo ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : ''; ?>
			data-wp-bind--title="context.product.name"
		>
	<?php endif; ?>

	<?php the_title(); ?>

	<?php if ( $is_link ) : ?>
		</a>
	<?php endif; ?>
</<?php echo esc_html( $html_tag ); ?>>

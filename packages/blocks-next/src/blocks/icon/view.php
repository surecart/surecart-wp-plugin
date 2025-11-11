<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<?php if ( ! empty( $link_url ) ) : ?>
		<a 
			href="<?php echo esc_url( $link_url ); ?>" 
			target="<?php echo esc_attr( $link_target ); ?>"
			<?php if ( ! empty( $link_rel ) ) : ?>
				rel="<?php echo esc_attr( $link_rel ); ?>"
			<?php endif; ?>
			style="<?php echo esc_attr( $icon_style_attr ); ?>"
		>
			<?php echo wp_kses( $icon_svg, sc_allowed_svg_html() ); ?>
		</a>
	<?php else : ?>
		<span style="<?php echo esc_attr( $icon_style_attr ); ?>">
			<?php echo wp_kses( $icon_svg, sc_allowed_svg_html() ); ?>
		</span>
	<?php endif; ?>
</div>

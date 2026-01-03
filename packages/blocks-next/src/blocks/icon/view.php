<<?php echo esc_html( $html_tag ); ?>
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array_filter(
				[
					'href'   => esc_url( $link_url ),
					'target' => esc_attr( $link_target ),
					'rel'    => esc_attr( trim( $link_rel . ( $nofollow ? ' nofollow' : '' ) ) ),
				]
			)
		)
	);
	?>
	>
	<span style="
	<?php
	echo esc_attr(
		implode(
			'; ',
			[
				'width: ' . esc_attr( $size ) . 'px',
				'height: ' . esc_attr( $size ) . 'px',
			]
		)
	);
	?>
	">
		<?php
		echo wp_kses(
			SureCart::svg()->get(
				$icon_name,
				[
					'stroke-width' => esc_attr( $stroke_width ),
					'class'        => 'surecart-icon',
				]
			),
			sc_allowed_svg_html()
		);
		?>
	</span>
</<?php echo esc_html( $html_tag ); ?>>

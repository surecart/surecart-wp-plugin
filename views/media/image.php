<figure
	data-wp-interactive='{ "namespace": "surecart/lightbox" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'sc-lightbox-container' ] ) ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'imageId' => $media->id, // this is needed for the lightbox to work.
			]
		)
	);
	?>
>
	<?php
	echo wp_kses(
		$media->withLightbox( $lightbox )->html(
			'large',
			array(
				'loading' => $loading ?? 'eager',
				'style'   => $style ?? '',
			)
		),
		sc_allowed_svg_html()
	);
	?>
	
	<?php if ( $lightbox ) : ?>
		<button
			class="lightbox-trigger"
			type="button"
			aria-haspopup="dialog"
			aria-label="<?php esc_attr_e( 'Expand image', 'surecart' ); ?>"
			data-wp-init="callbacks.initTriggerButton"
			data-wp-on-async--click="actions.showLightbox"
			data-wp-style--right="state.imageButtonRight"
			data-wp-style--top="state.imageButtonTop"
		> 
			<?php
			echo wp_kses(
				\SureCart::svg()->get(
					'maximize',
					[
						'width'  => 16,
						'height' => 16,
					]
				),
				sc_allowed_svg_html()
			);
			?>
		</button>
	<?php endif; ?>
</figure>

<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-interactive'            => '{ "namespace": "surecart/product-review-form" }',
				'data-wp-class--sc-modal-active' => 'state.open',
				'data-wp-watch--open'            => 'callbacks.handleOpenChange',
			]
		)
	);
	?>

	<?php
		echo wp_kses_data(
			wp_interactivity_data_wp_context(
				[
					'url'           => $close_url,
					'busy'          => false,
					'title'         => '',
					'rating'        => 0,
					'body'          => '',
					'sc_product_id' => esc_attr( $sc_product_id ),
				]
			)
		);
		?>
	>
	<div
		class="sc-product-review-form-dialog <?php echo esc_attr( $position_class ); ?>"
		style="<?php echo esc_attr( $style ); ?>"
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="<?php esc_attr_e( 'Write a product review', 'surecart' ); ?>"
		data-wp-on--keydown="callbacks.handleKeyDown"
		>
		<form
			data-wp-on--submit="callbacks.handleSubmit"
			data-wp-init="callbacks.init"
		>
			<div class="sc-product-review-form-dialog__content" style="<?php echo esc_attr( $content_style ); ?>">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		</form>
	</div>

	<div class="sc-product-review-form-overlay"
		data-wp-on--click="actions.close" 
		data-wp-bind--hidden="surecart/product-list::state.loading"
		aria-hidden="true"
		<?php
		echo wp_kses_data(
			wp_interactivity_data_wp_context(
				[
					'url' => $close_url,
				]
			)
		);
		?>
	></div>
</div>
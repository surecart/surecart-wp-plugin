<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-interactive'            => '{ "namespace": "surecart/product-review-form" }',
				'data-wp-class--sc-modal-active' => 'state.open',
				'data-wp-watch---open'           => 'callbacks.handleOpenChange',
				'data-wp-init'                   => 'callbacks.handleInit',
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
				'stars'         => 0,
				'body'          => '',
				'sc_product_id' => esc_attr( $sc_product_id ),
				'submitted'     => false,
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
		data-wp-bind--hidden="!state.open"
	>
		<form data-wp-on--submit="actions.handleSubmit">
			<div class="sc-product-review-form-dialog__content" style="<?php echo esc_attr( $content_style ); ?>">

				<?php if ( isset( $form_template ) ) : ?>
					<div data-wp-bind--hidden="context.submitted">
						<?php echo $form_template->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endif; ?>

				<?php if ( isset( $confirmation_template ) ) : ?>
					<div
						class="sc-product-review-confirmation"
						data-wp-bind--hidden="!context.submitted"
						role="status"
						aria-label="<?php esc_attr_e( 'Thanks for your review! Your review has been submitted successfully.', 'surecart' ); ?>"
					>
						<?php echo $confirmation_template->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endif; ?>
			</div>
		</form>
	</div>

	<div
		class="sc-product-review-form-overlay"
		data-wp-on--click="actions.close"
		data-wp-bind--hidden="surecart/product-review::state.loading"
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

<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
		echo wp_kses_data(
			wp_interactivity_data_wp_context(
				[
					'formId' => intval( $form->ID ),
					'mode'   => esc_attr( $form_mode ),
				]
			)
		);
		?>
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	data-wp-init="surecart/checkout::callbacks.init"
>
	<dialog
		class="sc-drawer"
		data-wp-on--click="surecart/dialog::actions.closeOverlay"
	>
		<div class="sc-drawer__wrapper">
			<?php echo do_blocks( $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			<div class="sc-block-ui" data-wp-bind--hidden="surecart/checkout::!state.loading" hidden></div>
		</div>
	</dialog>
</div>

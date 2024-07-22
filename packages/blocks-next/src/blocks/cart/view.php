<div
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
	data-wp-init="callbacks.init"
	data-wp-watch="callbacks.onChangeCheckout"
	data-wp-on-window--storage="callbacks.syncTabs"
>
	<dialog
		<?php
		echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'style'             => $style,
					'class'             => 'sc-drawer sc-cart-drawer',
					'aria-labelledby'   => 'sc-cart-title',
					'data-wp-on--click' => 'surecart/cart::actions.closeOverlay',
				)
			)
		);
		?>
	>
		<div class="sc-drawer__wrapper">
			<!-- Cart alert -->
			<div class="sc-alert sc-alert__alert--danger"
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				data-wp-bind--hidden="!state.error"
				hidden
			>
				<div class="sc-alert__icon">
					<?php echo wp_kses( SureCart::svg()->get( 'alert-circle', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
				</div>

				<div class="sc-alert__text">
					<div class="sc-alert__title">
						<span data-wp-text="state.errorTitle"></span>
					</div>
					<div class="sc-alert__message">
						<div data-wp-text="state.errorMessage"></div>
						<template data-wp-each--message="state.additionalErrors">
							<div>
								<span data-wp-text="context.message"></span>
							</div>
						</template>
					</div>
				</div>
			</div>

			<?php echo do_blocks( $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden></div>
		</div>
	</dialog>
</div>

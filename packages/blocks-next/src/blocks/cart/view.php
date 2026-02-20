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
	class="sc-cart-wrapper"
>
	<div
		<?php
		echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'style'                    => $style,
					'class'                    => 'sc-drawer sc-cart-drawer',
					'role'                     => 'dialog',
					'aria-modal'               => 'true',
					'data-wp-bind--aria-label' => 'surecart/cart::state.ariaLabel',
					'data-wp-class--open'      => 'surecart/cart::state.open',
					'data-wp-on--keydown'      => 'surecart/cart::actions.handleKeydown',
				)
			)
		);
		?>
	>
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
	<!-- backdrop -->
	<div class="sc-drawer__backdrop" data-wp-on--mousedown="surecart/cart::actions.closeOverlay" data-wp-on--touchstart="surecart/cart::actions.closeOverlay" data-wp-class--show="surecart/cart::state.open" data-wp-on--keydown="surecart/cart::actions.handleKeydown"></div>
</div>
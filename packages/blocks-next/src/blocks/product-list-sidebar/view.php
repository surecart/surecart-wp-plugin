<div
	<?php echo wp_kses_data( get_block_wrapper_attributes(
		array(
			'class' => 'sc-sidebar-desktop',
		)
	) ); ?>
	data-wp-bind--hidden="!state.sidebarOpen" 
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
<dialog
		<?php
		echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'class'                    => 'sc-drawer sc-cart-drawer',
					'data-wp-bind--aria-label' => 'surecart/cart::state.ariaLabel',
					'data-wp-on--click'        => 'surecart/cart::actions.closeOverlay',
					'data-wp-bind--hidden'     => '!state.sidebarOpen',
				)
			)
		);
		?>
	>
	<div class="sc-drawer__wrapper">
		<?php echo do_blocks( $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
	<!-- speak element -->
	<p id="a11y-speak-intro-text" class="a11y-speak-intro-text" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"></p>
	<div id="a11y-speak-assertive" class="a11y-speak-region" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;" aria-live="assertive" aria-relevant="additions text" aria-atomic="true">&nbsp;</div>
	<div id="a11y-speak-polite" class="a11y-speak-region" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;" aria-live="polite" aria-relevant="additions text" aria-atomic="true"></div>
</dialog>
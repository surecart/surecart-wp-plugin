<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-sidebar-desktop',
			)
		)
	); ?>
	aria-label="<?php echo esc_attr( $attributes['label'] ); ?>"
	data-wp-interactive='{ "namespace": "surecart/sidebar" }'
	data-wp-bind--hidden="!state.open"
	data-wp-on-window--resize="actions.close"
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>

<dialog
	class="sc-drawer sc-sidebar-drawer wp-block-surecart-product-list-sidebar"
	data-wp-interactive='{ "namespace": "surecart/sidebar" }'
	aria-label="<?php echo esc_attr( $attributes['label'] ); ?>"
	data-wp-on--click='actions.closeOverlay'
	data-wp-on-window--resize="actions.close"
>
	<div
		<?php
		echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'class' => 'sc-drawer__wrapper',
				)
			)
		);
		?>
	>
		<div class="sc-sidebar-header">
			<span class="sc-sidebar-header__title" inert>
				<?php echo wp_kses_post( $attributes['label'] ); ?>
			</span>
			<div
				class="sc-sidebar-header__close"
				data-wp-on--click="actions.toggleMobile"
				data-wp-on--keydown="actions.toggleMobile"
				role="button"
				tabindex="0"
				aria-label="<?php esc_attr_e( 'Close sidebar', 'surecart' ); ?>"
			>
				<?php echo wp_kses( SureCart::svg()->get( 'arrow-right' ), sc_allowed_svg_html() ); ?>
			</div>

		</div>
		<div class="sc-drawer__items">
			<?php echo do_blocks( $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<div class="wp-block-buttons">
			<div class="wp-block-button">
				<button
					class="wp-block-button__link wp-element-button"
					data-wp-on--click="actions.toggleMobile"
					data-wp-on--keydown="actions.toggleMobile"
				>
					<?php
						// translators: %d is the current count of posts.
						printf( esc_html__( 'View Results (%d)', 'surecart' ), wp_kses_post( $query->found_posts ) );
					?>
				</button>
			</div>
		</div>
	</div>
	<div class="sc-block-ui" data-wp-interactive='{ "namespace": "surecart/product-list" }' data-wp-bind--hidden="!state.loading" hidden aria-busy="true" aria-label="<?php esc_attr_e( 'Loading filters', 'surecart' ); ?>"></div>
	<!-- speak element -->
	<p id="a11y-speak-intro-text" class="a11y-speak-intro-text" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"></p>
	<div id="a11y-speak-assertive" class="a11y-speak-region" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;" aria-live="assertive" aria-relevant="additions text" aria-atomic="true">&nbsp;</div>
	<div id="a11y-speak-polite" class="a11y-speak-region" style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;" aria-live="polite" aria-relevant="additions text" aria-atomic="true"></div>
</dialog>

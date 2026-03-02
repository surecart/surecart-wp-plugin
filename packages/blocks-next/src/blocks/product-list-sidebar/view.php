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

<div
	class="sc-drawer sc-sidebar-drawer wp-block-surecart-product-list-sidebar"
	role="dialog"
	aria-modal="true"
	data-wp-interactive='{ "namespace": "surecart/sidebar" }'
	aria-label="<?php echo esc_attr( $attributes['label'] ); ?>"
	data-wp-on-window--resize="actions.close"
	data-wp-class--open="surecart/sidebar::state.mobileOpen"
	data-wp-on--keydown="surecart/sidebar::actions.handleKeydown"
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
				<?php echo wp_kses( SureCart::svg()->get( 'arrow-right', [ 'aria-hidden' => 'true' ] ), sc_allowed_svg_html() ); ?>
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
</div>
<div
	class="sc-drawer__backdrop"
	data-wp-interactive='{ "namespace": "surecart/sidebar" }'
	data-wp-on--mousedown="surecart/sidebar::actions.closeOverlay"
	data-wp-on--touchstart="surecart/sidebar::actions.closeOverlay"
	data-wp-class--show="surecart/sidebar::state.mobileOpen"
></div>

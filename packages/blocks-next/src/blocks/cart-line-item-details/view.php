<div
	data-wp-interactive='{ "namespace": "surecart/line-item-details" }'
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-cart-line-item-details',
				'style' => '--sc-line-item-details-collapse-lines:' . $collapse_after . ';',
			)
		)
	);
	?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'detailsExpanded' => $expanded,
				'collapseAfter'   => $collapse_after,
				'showToggle'      => false,
				'hiddenCount'     => 0,
			)
		)
	);
	?>
	data-wp-run="callbacks.init"
	data-wp-bind--hidden="surecart/checkout::!state.hasLineItemDetails"
	data-wp-class--sc-cart-line-item-details--is-expanded="context.detailsExpanded"
	data-wp-class--sc-cart-line-item-details--is-collapsible="context.showToggle"
	data-wp-on--click="actions.toggleDetailsExpanded"
	data-wp-on--keydown="actions.toggleDetailsExpanded"
	data-wp-bind--role="state.role"
	data-wp-bind--tabindex="state.tabindex"
	data-wp-bind--aria-expanded="context.detailsExpanded"
	aria-label="<?php esc_attr_e( 'Toggle line item details', 'surecart' ); ?>"
>
	<div class="sc-cart-line-item-details__content">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>

	<span
		class="sc-cart-line-item-details__toggle"
		data-wp-bind--hidden="!context.showToggle"
	>
		<span
			class="sc-cart-line-item-details__toggle-label"
			data-wp-text="surecart/checkout::state.detailsToggleLabel"
		></span>
		<span
			class="sc-cart-line-item-details__toggle-icon"
			data-wp-class--sc-cart-line-item-details__toggle-icon--rotated="context.detailsExpanded"
		>
			<?php
			echo wp_kses(
				SureCart::svg()->get(
					'chevron-down',
					array(
						'class'  => '',
						'width'  => 16,
						'height' => 16,
					)
				),
				sc_allowed_svg_html()
			);
			?>
		</span>
	</span>
</div>

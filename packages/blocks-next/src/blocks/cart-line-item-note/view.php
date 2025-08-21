<div
	data-wp-interactive='{ "namespace": "surecart/line-item-note" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [] ) ); ?>
	data-wp-run="callbacks.init"
	data-wp-class--line-item-note--is-expanded="context.noteExpanded"
	data-wp-class--line-item-note--is-collapsible="context.showToggle"
	data-wp-bind--hidden="surecart/checkout::!state.lineItemNote"
	data-wp-on--click="actions.toggleNoteExpanded"
	data-wp-on--keydown="actions.toggleNoteExpanded"
	data-wp-bind--role="button"
	data-wp-bind--disabled="!context.showToggle"
	data-wp-bind--aria-expanded="context.noteExpanded"
	data-wp-bind--aria-label="<?php esc_attr_e( 'Toggle note visibility', 'surecart' ); ?>"
	tabindex="0"
>
	<div
		class="line-item-note__text"
		data-wp-text="surecart/checkout::state.lineItemNote"
	></div>
	<span
		class="sc-icon"
		data-wp-class--sc-icon--rotated="context.noteExpanded"
	>
		<?php
		echo wp_kses(
			SureCart::svg()->get(
				'chevron-down',
				[
					'class'  => '',
					'width'  => 16,
					'height' => 16,
				]
			),
			sc_allowed_svg_html()
		);
		?>
	</span>
</div>
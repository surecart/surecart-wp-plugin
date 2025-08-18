<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
>
	<div
		class="line-item-note"
		data-wp-class--line-item-note--is-expanded="state.lineItemNoteExpanded"
		data-wp-class--line-item-note--clickable="state.showLineItemNoteToggle"
		data-wp-on--click="actions.toggleLineItemNote"
		data-wp-bind--role="state.showLineItemNoteToggle ? 'button' : null"
		data-wp-bind--tabindex="state.showLineItemNoteToggle ? '0' : null"
		data-wp-bind--aria-expanded="state.showLineItemNoteToggle ? state.lineItemNoteExpanded : null"
		data-wp-bind--aria-label="state.showLineItemNoteToggle ? state.lineItemNoteAriaLabel : null"
	>
		<div
			class="line-item-note__text"
			data-wp-bind--id="state.lineItemNoteId"
			data-wp-text="context.line_item.note"
		></div>
		<button
			type="button"
			class="line-item-note__toggle"
			data-wp-bind--hidden="!state.showLineItemNoteToggle"
			data-wp-on--click="actions.stopPropagationAndToggle"
			data-wp-bind--aria-expanded="state.lineItemNoteExpanded"
			data-wp-bind--aria-label="state.lineItemNoteAriaLabel"
			data-wp-bind--aria-controls="state.lineItemNoteId"
			data-wp-bind--aria-describedby="state.lineItemNoteId"
		>
			<span class="sc-icon" data-wp-class--sc-icon--rotated="state.lineItemNoteExpanded">
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
		</button>
	</div>
</div>
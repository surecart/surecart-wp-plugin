<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
>
	<div
		class="line-item-note"
		data-wp-class--line-item-note--is-expanded="state.lineItemNoteExpanded"
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
			data-wp-on--click="actions.toggleLineItemNote"
			data-wp-bind--aria-expanded="state.lineItemNoteExpanded"
			data-wp-bind--aria-label="state.lineItemNoteAriaLabel"
			data-wp-bind--aria-controls="state.lineItemNoteId"
			data-wp-bind--aria-describedby="state.lineItemNoteId"
		>
			<span class="sc-icon" data-wp-class--sc-icon--rotated="state.lineItemNoteExpanded">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"/>
				</svg>
			</span>
		</button>
	</div>
</div>
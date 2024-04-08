<?php
$dummy_options = [
	array('label' => 'First First Option Option', 'value' => 'first-option'),
	array('label' => 'Second Option', 'value' => 'second-option'),
	array('label' => 'Third Option', 'value' => 'third-option'),
	array('label' => 'Fourth Option', 'value' => 'fourth-option'),
	array('label' => 'Fifth Option', 'value' => 'fifth-option'),
];
?>
<div 
	class="sc-dropdown" 
	data-wp-interactive='{ "namespace": "surecart/dropdown" }'
	<?php echo wp_kses_data(
        wp_interactivity_data_wp_context(
            [
                'isMenuOpen' => false, 
                'selectedItem' => $dummy_options[0] ?? [],
            ]
        )
    ); ?>
	data-wp-on-document--click="actions.closeMenu"
	<?php echo get_block_wrapper_attributes(); ?>
>
	<button 
		class="sc-dropdown__trigger button button--standard button--medium button--default button--caret button--has-label"
		data-wp-on--click="actions.toggleMenu"
		aria-label="Press Space or Enter to open the dropdown"
	>
		<span class="button__label" data-wp-text="state.getSelectedOptionLabel">
			<?php echo $dummy_options[0]['label'] ?? 'First Option'; ?>
        </span>
		<span class="button__caret">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</span>
	</button>
	<div 
		class="sc-dropdown__panel"
		data-wp-bind--hidden="!context.isMenuOpen"
		role="menu"
		data-wp-watch="callbacks.focusFirstMenuItem"
		aria-hidden="!context.isMenuOpen"
	>
		<?php foreach ($dummy_options as $option) : ?>
			<div 
				role="menuitem"
				tabindex="0" 
				class="sc-dropdown__menu-item"
				data-wp-on--click="actions.selectItem"
				data-wp-on--keyup="actions.menuItemKeyUp"
				data-value="<?php echo esc_attr($option['value'] ?? ''); ?>"
				data-label="<?php echo esc_attr($option['label'] ?? ''); ?>"
			>
				<?php echo esc_html($option['label'] ?? ''); ?>
		</div>
		<?php endforeach; ?>
	</div>
</div>
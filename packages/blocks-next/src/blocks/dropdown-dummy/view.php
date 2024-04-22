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
				'activeMenuItemId' => 'sc-menu-item-0',
				'index' => 0,
				'totalOptions' => count($dummy_options),
            ]
        )
    ); ?>
	data-wp-on-document--click="actions.closeMenu"
	data-wp-bind--aria-activedescendant="context.activeMenuItemId"
	data-wp-on--keyup="actions.menuItemKeyUp"
	role="menu"
	tabindex="-1"
	<?php echo get_block_wrapper_attributes(); ?>
>
	<button
		class="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text"
		data-wp-on--click="actions.toggleMenu"
		data-wp-on--keyup="actions.triggerKeyUp"
	>
		<span class="sc-button__label" data-wp-text="state.getSelectedOptionLabel">
			<?php echo $dummy_options[0]['label'] ?? 'First Option'; ?>
        </span>
		<span class="sc-button__caret">
			<?php echo SureCart::svg()->get( 'chevron-down' ); ?>
		</span>
	</button>
	<div
		class="sc-dropdown__panel"
		data-wp-bind--hidden="!context.isMenuOpen"
		data-wp-watch="callbacks.focusFirstMenuItem"
		aria-hidden="!context.isMenuOpen"
	>
		<?php foreach ($dummy_options as $key => $option) : ?>
			<div
				role="menuitem"
				tabindex="-1"
				class="sc-dropdown__menu-item"
				data-wp-on--click="actions.selectItem"
				data-wp-class--sc-checked="state.isMenuItemSelected"
				data-wp-class--sc-focused="state.isMenuItemFocused"
				id="<?php echo "sc-menu-item-" . $key ?>"
				<?php echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'value' => $option['value'] ?? '',
							'label' => $option['label'] ?? '',
						]
					)
				); ?>
			>
				<span class="sc-dropdown__menu-item__label">
					<?php echo esc_html($option['label'] ?? ''); ?>
				</span>
				<span class="menu-item__check">
					<?php echo SureCart::svg()->get( 'check' ); ?>
				</span>
		</div>
		<?php endforeach; ?>
	</div>
</div>

<sc-dropdown style="--panel-width: 400px">
	<sc-button slot="trigger" caret type="text">Trigger</sc-button>
	<sc-menu>
	<?php foreach ($dummy_options as $option) : ?>
		<sc-menu-item>
		<?php echo esc_html($option['label'] ?? ''); ?>
		</sc-menu-item>
	<?php endforeach; ?>
	</sc-menu>
</sc-dropdown>

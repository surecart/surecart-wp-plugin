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
		class="sc-dropdown__trigger button button--standard button--medium button--caret button--has-label button--text"
		data-wp-on--click="actions.toggleMenu"
		data-wp-on--keyup="actions.triggerKeyUp"
		aria-label="Press Space or Enter to open the dropdown"
	>
		<span class="button__label" data-wp-text="state.getSelectedOptionLabel">
			<?php echo $dummy_options[0]['label'] ?? 'First Option'; ?>
        </span>
		<span class="button__caret">
			<?php echo SureCart::svg()->get( 'chevron-down' ); ?>
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
				data-wp-on--mouseenter="actions.hoverMenuItem"
				data-wp-on--mouseleave="actions.hoverMenuItem"
				data-wp-on--focusin="actions.hoverMenuItem"
				data-wp-on--focusout="actions.hoverMenuItem"
				data-wp-class--checked="state.isMenuItemSelected"
				data-wp-class--menu-item--focused="context.focused"
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

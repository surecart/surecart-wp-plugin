<?php
$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$sort_key = isset( $block_id ) ? 'products-' . $block_id . '-sort' : 'products-sort';
$sort = empty( $_GET[ $sort_key ] ) ? 'created_at:desc' : sanitize_text_field( $_GET[ $sort_key ] );
$options = [
	array( 'value' => 'created_at:desc', 'label' => esc_html__( 'Latest', 'surecart' ) ),
    array( 'value' => 'created_at:asc', 'label' => esc_html__( 'Oldest', 'surecart' ) ),
    array( 'value' => 'name:asc', 'label' => esc_html__( 'Alphabetical, A-Z', 'surecart' ) ),
    array( 'value' => 'name:desc', 'label' => esc_html__( 'Alphabetical, Z-A', 'surecart' ) ),
];
$selected_option = $options[0] ?? [];

foreach ( $options as $option ) {
    if ( $option['value'] === $sort ) {
        $selected_option = $option;
        break;
    }
}

?>
<div
	data-wp-interactive='{ "namespace": "surecart/dropdown" }'
	<?php echo wp_kses_data(
        wp_interactivity_data_wp_context(
            [
                'isMenuOpen' => false,
                'selectedItem' => $selected_option,
				'activeMenuItemId' => 'sc-menu-item-0',
				'index' => 0,
				'totalOptions' => count($options),
				'options' => $options,
            ]
        )
    ); ?>
	data-wp-on-document--click="surecart/dropdown::actions.closeMenu"
	data-wp-bind--aria-activedescendant="context.activeMenuItemId"
	data-wp-on--keyup="surecart/dropdown::actions.menuKeyUp"
	data-wp-on--keydown="surecart/dropdown::actions.menuKeyDown"
	role="menu"
	tabindex="-1"
	data-wp-bind--aria-labelledby="context.activeMenuItemId"
	<?php echo get_block_wrapper_attributes( [ 'class' => 'sc-dropdown' ] ); ?>
>
	<button
		class="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text"
		data-wp-on--click="surecart/dropdown::actions.toggleMenu"
		data-wp-on--keyup="surecart/dropdown::actions.triggerKeyUp"
	>
		<span class="sc-button__label" data-wp-text="surecart/dropdown::state.getSelectedOptionLabel">
			<?php echo $options[0]['label'] ?? 'First Option'; ?>
        </span>
		<span class="sc-button__caret">
			<?php echo SureCart::svg()->get( 'chevron-down' ); ?>
		</span>
	</button>
	<div
		class="sc-dropdown__panel"
		data-wp-bind--hidden="!context.isMenuOpen"
		aria-hidden="!context.isMenuOpen"
	>
		<?php foreach ($options as $key => $option) : ?>
			<a
				role="menuitem"
				tabindex="-1"
				class="sc-dropdown__menu-item"
				data-wp-on--click="surecart/product-list::actions.onSortMenuItemClick"
				data-wp-on--click--navigate="surecart/product-list::actions.navigate"
				data-wp-on--click--select-item="surecart/dropdown::actions.selectItem"
				data-wp-class--sc-checked="surecart/dropdown::state.isMenuItemSelected"
				data-wp-class--sc-focused="surecart/dropdown::state.isMenuItemFocused"
				id="<?php echo "sc-menu-item-" . $key ?>"
                href="<?php echo esc_url(add_query_arg($sort_key, $option['value'])) ?>"
				data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
				data-wp-watch="surecart/product-list::callbacks.prefetch"
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
		</a>
		<?php endforeach; ?>
	</div>
</div>


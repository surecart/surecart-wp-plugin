<div
	<?php echo get_block_wrapper_attributes( [ 'class' => 'sc-dropdown' ] ); ?>
	<?php echo wp_interactivity_data_wp_context(
		[
			'isMenuOpen' => false,
			'index' => 0, // needed to keep track of the focused item
		]
    ); ?>
	data-wp-interactive='{ "namespace": "surecart/dropdown" }'
	data-wp-on-document--click="surecart/dropdown::actions.closeOnClickOutside"
	data-wp-bind--aria-activedescendant="context.activeMenuItemId"
	data-wp-on--keyup="surecart/dropdown::actions.menuKeyUp"
	data-wp-on--keydown="surecart/dropdown::actions.menuKeyDown"
	role="menu"
	tabindex="-1"
	data-wp-bind--aria-labelledby="context.activeMenuItemId"
>
	<div
		class="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text"
		data-wp-on--click="surecart/dropdown::actions.toggleMenu"
		role="button"
		tabindex="0"
	>
		<span class="sc-button__label">
			<?php echo wp_kses_post($selected_option['label']); ?>
        </span>
		<span class="sc-button__caret">
			<?php echo SureCart::svg()->get( 'chevron-down' ); ?>
		</span>
	</div>

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
				id="<?php echo esc_attr( wp_unique_id( 'sc-menu-item-' ) ); ?>"
                href="<?php echo esc_url($option['href']) ?>"
				data-wp-on--click="surecart/product-list::actions.navigate"
				data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
				data-wp-class--sc-focused="surecart/dropdown::state.isMenuItemFocused"
			>
				<span class="sc-dropdown__menu-item__label">
					<?php echo esc_html($option['label'] ?? ''); ?>
				</span>
				<?php if ($option['checked']) : ?>
					<span class="sc-menu-item__check">
						<?php echo SureCart::svg()->get( 'check' ); ?>
					</span>
				<?php endif; ?>
			</a>
		<?php endforeach; ?>
	</div>
</div>


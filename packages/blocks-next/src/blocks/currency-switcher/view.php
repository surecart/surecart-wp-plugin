<?php
/**
 * Currency switcher block view.
 *
 * @package SureCart
 */

use SureCart\Models\DisplayCurrency;

// Get all display currencies.
$currencies = DisplayCurrency::get();

// Get current currency from URL or default.
$current_currency = ! empty( $_GET['currency'] ) ? strtoupper( sanitize_text_field( wp_unslash( $_GET['currency'] ) ) ) : strtoupper( \SureCart::account()->currency );
?>

<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'class' => 'sc-dropdown' ] ) ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'isMenuOpen' => false,
				'index'      => 0,
			]
		)
	);
	?>
	data-wp-interactive='{ "namespace": "surecart/dropdown" }'
	data-wp-on-async-window--click="surecart/dropdown::callbacks.maybeCloseMenu"
	data-wp-on-async-window--focusin="surecart/dropdown::callbacks.maybeCloseMenu"
	data-wp-on-async-window--keydown="surecart/dropdown::callbacks.maybeCloseMenu"
	data-wp-bind--aria-activedescendant="context.activeMenuItemId"
	data-wp-on--keyup="surecart/dropdown::actions.menuKeyUp"
	data-wp-on--keydown="surecart/dropdown::actions.menuKeyDown"
	data-wp-init="surecart/currency-switcher::callbacks.initialize"
	role="menu"
	tabindex="-1"
	data-wp-bind--aria-labelledby="context.activeMenuItemId"
	aria-description="<?php esc_html_e( 'Press the arrow keys then enter to make a selection.', 'surecart' ); ?>"
>
	<div
		class="wp-block-surecart-currency-switcher__trigger"
		data-wp-on--click="surecart/dropdown::actions.toggleMenu"
		role="button"
		tabindex="0"
		aria-label="<?php esc_attr_e( 'Select Currency', 'surecart' ); ?>"
	>
		<span class="wp-block-surecart-currency-switcher__label"><?php echo esc_html( $current_currency ); ?></span>
		<span class="wp-block-surecart-currency-switcher__caret"><?php echo wp_kses( SureCart::svg()->get( 'chevron-down' ), sc_allowed_svg_html() ); ?></span>
	</div>

	<div
		class="sc-dropdown__panel sc-dropdown__panel--right"
		data-wp-bind--hidden="!context.isMenuOpen"
		data-wp-bind--aria-hidden="!context.isMenuOpen"
		hidden
	>
		<?php foreach ( $currencies as $currency ) : ?>
			<?php
			// Get the current URL.
			$url = add_query_arg( 'currency', strtolower( $currency->currency ), remove_query_arg( 'currency' ) );
			?>
			<a
				role="menuitem"
				tabindex="-1"
				class="sc-dropdown__menu-item"
				id="<?php echo esc_attr( wp_unique_id( 'sc-menu-item-' ) ); ?>"
				href="<?php echo esc_url( $url ); ?>"
				data-wp-on--click="surecart/currency-switcher::actions.navigate"
				data-wp-class--sc-focused="surecart/dropdown::state.isMenuItemFocused"
			>
				<span class="sc-dropdown__menu-item__label">
					<?php echo esc_html( $currency->name ); ?>
				</span>

				<?php if ( strtolower( $currency->currency ) === strtolower( $current_currency ) ) : ?>
					<span class="sc-menu-item__check">
						<?php echo wp_kses( SureCart::svg()->get( 'check' ), sc_allowed_svg_html() ); ?>
					</span>
				<?php endif; ?>
			</a>
		<?php endforeach; ?>
	</div>
</div>

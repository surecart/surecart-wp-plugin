<?php
/**
 * Currency switcher block view.
 *
 * @package SureCart
 */

use SureCart\Models\DisplayCurrency;
use SureCart\Support\Currency;

// Get all display currencies.
$currencies = DisplayCurrency::get();

if ( is_wp_error( $currencies ) || empty( $currencies ) ) {
	return;
}

// Sort by currency name.
usort(
	$currencies,
	function ( $a, $b ) {
		return strcmp( $a->name, $b->name );
	}
);

// Get current currency from URL or default.
$current_currency = Currency::getCurrentCurrency();
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
	tabindex="-1"
	data-wp-bind--aria-labelledby="context.activeMenuItemId"
>
	<div
		class="wp-block-surecart-currency-switcher__trigger"
		data-wp-on--click="surecart/dropdown::actions.toggleMenu"
		role="button"
		tabindex="0"
		aria-label="<?php esc_attr_e( 'Select Currency', 'surecart' ); ?>"
	>
		<img
			src="<?php echo esc_url( plugins_url( 'images/flags/' . strtolower( $current_currency ) . '.svg', SURECART_PLUGIN_FILE ) ); ?>"
			alt="<?php echo esc_attr( strtoupper( $current_currency ) ); ?> flag"
			class="wp-block-surecart-currency-switcher__flag"
			width="20"
			height="15"
		/>
		<span class="wp-block-surecart-currency-switcher__label"><?php echo esc_html( apply_filters( 'surecart/currency_switcher/label', strtoupper( $current_currency ) ) ); ?></span>
		<span class="wp-block-surecart-currency-switcher__caret">
		<?php
		echo wp_kses(
			SureCart::svg()->get(
				'chevron-down',
				[
					'width'  => 16,
					'height' => 16,
				]
			),
			sc_allowed_svg_html()
		);
		?>
		</span>
	</div>

	<div
		class="sc-dropdown__panel sc-dropdown__panel--<?php echo esc_attr( $attributes['position'] ); ?>"
		data-wp-bind--hidden="!context.isMenuOpen"
		data-wp-bind--aria-hidden="!context.isMenuOpen"
		hidden
		role="menu"
		aria-description="<?php esc_html_e( 'Press the arrow keys then enter to make a selection.', 'surecart' ); ?>"
		aria-orientation="vertical"
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
				<img
					src="<?php echo esc_url( plugins_url( 'images/flags/' . strtolower( $currency->currency ) . '.svg', SURECART_PLUGIN_FILE ) ); ?>"
					alt="<?php echo esc_attr( strtoupper( $currency->currency ) ); ?> flag"
					class="sc-dropdown__menu-item__flag"
					width="20"
					height="15"
					loading="lazy"
				/>
				<span class="sc-dropdown__menu-item__label">
					<?php echo esc_html( $currency->name ); ?>
					<span class="sc-dropdown__menu-item__symbol">(<?php echo esc_html( $currency->currency_symbol ); ?>)</span>
				</span>

				<?php
				if ( strtolower( $currency->currency ) === strtolower( $current_currency ) ) :
					?>
					<span class="sc-menu-item__check sc-menu-item__check--right">
						<?php echo wp_kses( SureCart::svg()->get( 'check' ), sc_allowed_svg_html() ); ?>
					</span>
				<?php endif; ?>
			</a>
		<?php endforeach; ?>
	</div>
</div>

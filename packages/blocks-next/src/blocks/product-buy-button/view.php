<div <?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class'            => 'wp-block-button ' . esc_attr( $width_class ),
				'data-sc-block-id' => 'product-buy-button',
			)
		)
	);
	?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'checkoutUrl'     => esc_url( \SureCart::pages()->url( 'checkout' ) ),
				'buttonText'      => $attributes['text'] ?? ( $add_to_cart ? __( 'Add to Cart', 'surecart' ) : __( 'Buy Now', 'surecart' ) ),
				'outOfStockText'  => esc_attr( $attributes['out_of_stock_text'] ?? __( 'Sold Out', 'surecart' ) ),
				'unavailableText' => esc_attr( $attributes['unavailable_text'] ?? __( 'Unavailable For Purchase', 'surecart' ) ),
				'addToCart'       => $add_to_cart ?? true,
			)
		)
	);
	?>
	>
	<?php if ( ! $add_to_cart ) { ?>
		<button
			class="wp-block-button__link wp-element-button sc-button__link <?php echo ! empty( $styles['classnames'] ) ? esc_attr( $styles['classnames'] ) : ''; ?>"
			data-wp-bind--disabled="state.isUnavailable"
			style="<?php echo ! empty( $styles['css'] ) ? esc_attr( $styles['css'] ) : ''; ?>"
			data-wp-on--click="callbacks.redirectToCheckout"
		>
			<?php if ( ( 'icon' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) && 'before' === ( $attributes['iconPosition'] ?? 'before' ) ) : ?>
				<?php echo wp_kses( SureCart::svg()->get( $attributes['iconName'] ?? 'plus' ), sc_allowed_svg_html() ); ?>
			<?php endif; ?>
			
			<?php if ( 'text' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) : ?>
				<span class="sc-button__link-text" data-wp-text="state.buttonText">
				</span>
			<?php endif; ?>
			
			<?php if ( ( 'icon' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) && 'after' === ( $attributes['iconPosition'] ?? 'before' ) ) : ?>
				<?php echo wp_kses( SureCart::svg()->get( $attributes['iconName'] ?? 'plus' ), sc_allowed_svg_html() ); ?>
			<?php endif; ?>
		</button>
		<?php
	} else {
		?>
		<button
			class="wp-block-button__link wp-element-button sc-button__link <?php echo ! empty( $styles['classnames'] ) ? esc_attr( $styles['classnames'] ) : ''; ?>"
			data-wp-bind--disabled="state.isUnavailable"
			data-wp-class--sc-button__link--busy="context.busy"
			style="<?php echo ! empty( $styles['css'] ) ? esc_attr( $styles['css'] ) : ''; ?>"
		>
			<span class="sc-spinner" aria-hidden="false"></span>
			
			<?php if ( ( 'icon' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) && 'before' === ( $attributes['iconPosition'] ?? 'before' ) ) : ?>
				<?php echo wp_kses( SureCart::svg()->get( $attributes['iconName'] ?? 'plus' ), sc_allowed_svg_html() ); ?>
			<?php endif; ?>
			
			<?php if ( 'text' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) : ?>
				<span class="sc-button__link-text" data-wp-text="state.buttonText">
				</span>
			<?php endif; ?>
			
			<?php if ( ( 'icon' === ( $attributes['icon'] ?? 'text' ) || 'both' === ( $attributes['icon'] ?? 'text' ) ) && 'after' === ( $attributes['iconPosition'] ?? 'before' ) ) : ?>
				<?php echo wp_kses( SureCart::svg()->get( $attributes['iconName'] ?? 'plus' ), sc_allowed_svg_html() ); ?>
			<?php endif; ?>
		</button>
		<?php
	}
	?>
</div>

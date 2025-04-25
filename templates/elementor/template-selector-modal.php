<div id="sc-elementor-modal-dialog" role="dialog" aria-labelledby="sc-elementor-modal-title" aria-modal="true">
	<div class="sc-elementor-modal-overlay" tabindex="-1" aria-hidden="true"></div>
	<div class="sc-elementor-modal-content">
		<div class="sc-elementor-modal-header">
			<h2 id="sc-elementor-modal-title">
				<img style="display: block" src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ); ?>" alt="SureCart" width="125">
			</h2>

			<button id="sc-elementor-modal-close" aria-label="<?php esc_attr_e( 'Close dialog', 'surecart' ); ?>">
				<?php echo wp_kses( \SureCart::svg()->get( 'x', [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
			</button>
		</div>

		<div class="sc-elementor-modal-card-container">
			<div class="sc-elementor-modal-card" id="sc-elementor-single-product-template" tabindex="0" role="button" aria-label="<?php esc_attr_e( 'Single Product Template', 'surecart' ); ?>">
				<img src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/elementor/single-product-template.png' ); ?>" alt="<?php esc_attr_e( 'Single Product Template', 'surecart' ); ?>" />
				<h4><?php esc_html_e( 'Single Product Template', 'surecart' ); ?></h4>
			</div>
			<div class="sc-elementor-modal-card" id="sc-elementor-product-card-template" tabindex="0" role="button" aria-label="<?php esc_attr_e( 'Product Card Template', 'surecart' ); ?>">
				<img src="<?php echo esc_url( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/elementor/product-card-template.png' ); ?>" alt="<?php esc_attr_e( 'Product Card Template', 'surecart' ); ?>" />
				<h4><?php esc_html_e( 'Product Card Template', 'surecart' ); ?></h4>
			</div>
		</div>
	</div>
</div>

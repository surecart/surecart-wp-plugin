<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor editor scripts.
 */
class ElementorEditorService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/frontend/before_enqueue_styles', [ $this, 'add_surecart_icon' ], 1 );
		add_action( 'elementor/frontend/before_enqueue_styles', [ $this, 'enqueue_editor_assets' ], 1 );
		add_action( 'elementor/editor/after_enqueue_scripts', [ $this, 'show_template_selection_modal' ] );
	}

	/**
	 * Add SureCart icon to Elementor.
	 *
	 * @return void
	 */
	public function add_surecart_icon() {
		$src = esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' );
		$css = "
        .elementor-add-new-section .elementor-surecart-template-button {
            -webkit-mask: url({$src}) no-repeat center;
            mask: url({$src}) no-repeat center;
            -webkit-mask-size: contain;
            mask-size: contain;
            background-color: #01824c !important;
            transition: opacity 0.3s ease;
        }
        .elementor-add-new-section .elementor-surecart-template-button:hover {
            opacity: 0.8;
        }
        .elementor-add-new-section .elementor-surecart-template-button > i {
            height: 12px;
        }
        body .elementor-add-new-section .elementor-add-section-area-button {
            margin-left: 0;
        }";

		wp_add_inline_style(
			'elementor-icons',
			$css
		);
	}

	/**
	 * Enqueue SureCart editor assets.
	 *
	 * @return void
	 */
	public function enqueue_editor_assets() {
		wp_register_style(
			'surecart-elementor-editor',
			plugins_url( 'app/src/Integrations/Elementor/assets/editor.css', SURECART_PLUGIN_FILE ),
			[],
			filemtime( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'app/src/Integrations/Elementor/assets/editor.css' )
		);

		wp_enqueue_style( 'surecart-elementor-editor' );
	}

	/**
	 * Output the template selection modal.
	 *
	 * @return void
	 */
	public function show_template_selection_modal() {
		$single_product_template_image = trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/elementor/single-product-template.png';
		$product_card_template_image   = trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/elementor/product-card-template.png';
		?>
		<div id="surecart-custom-dialog">
			<div class="surecart-dialog-overlay"></div>
			<div class="surecart-dialog-content">
				<button id="surecart-dialog-close" aria-label="<?php esc_attr_e( 'Close dialog', 'surecart' ); ?>">⛌</button>
				<h2><?php esc_html_e( 'Select a SureCart Template', 'surecart' ); ?></h2>
				<div class="surecart-card-container">
					<div class="surecart-card" id="surecart-single-product-template">
						<img src="<?php echo esc_url( $single_product_template_image ); ?>" alt="<?php esc_attr_e( 'Single Product Template', 'surecart' ); ?>" />
						<h4><?php esc_html_e( 'Single Product Template', 'surecart' ); ?></h4>
					</div>
					<div class="surecart-card" id="surecart-product-card-template">
						<img src="<?php echo esc_url( $product_card_template_image ); ?>" alt="<?php esc_attr_e( 'Product Card Template', 'surecart' ); ?>" />
						<h4><?php esc_html_e( 'Product Card Template', 'surecart' ); ?></h4>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}

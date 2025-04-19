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
}

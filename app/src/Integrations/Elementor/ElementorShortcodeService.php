<?php

namespace SureCart\Integrations\Elementor;

/**
 * Elementor shortcode service.
 * Handles the wrapping of SureCart shortcodes in the Elementor content.
 */
class ElementorShortcodeService {
	/**
	 * Should wrap.
	 *
	 * @var bool
	 */
	protected $should_wrap = false;

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/frontend/before_get_builder_content', array( $this, 'wrapShortcodesInProductWrapper' ) );
	}

	/**
	 * Wrap shortcodes in product wrapper.
	 *
	 * @param \Elementor\Document $document The Elementor document.
	 *
	 * @return \Elementor\Document
	 */
	public function wrapShortcodesInProductWrapper( $document ) {
		$sc_shortcodes = $this->findSurecartShortcodes( $document->get_elements_data() );

		if ( ! empty( $sc_shortcodes ) ) {
			add_filter(
				'elementor/frontend/the_content',
				function ( $content ) {
					if ( empty( sc_get_product() ) ) {
						return $content;
					}
					return '<!-- wp:surecart/product-page {"align":"wide"} -->' . $content . '<!-- /wp:surecart/product-page -->';
				},
				9 // this is important to run this filter at the end of the content.
			);
		}
		return $document;
	}

	/**
	 * Find all SureCart shortcodes in the Elementor data.
	 *
	 * @param array $elements The elements data to search through.
	 * @param array $found_shortcodes Array to store found shortcodes.
	 *
	 * @return array Found shortcodes.
	 */
	private function findSurecartShortcodes( $elements, &$found_shortcodes = [] ) {
		if ( ! is_array( $elements ) ) {
			return $found_shortcodes;
		}

		foreach ( $elements as $element ) {
			// Check if this is a widget with a shortcode.
			if ( isset( $element['widgetType'] ) &&
				'shortcode' === $element['widgetType'] &&
				isset( $element['settings']['shortcode'] ) &&
				0 === strpos( $element['settings']['shortcode'], '[sc_' )
			) {
				$found_shortcodes[] = $element['settings']['shortcode'];
			}

			// Recursively search through nested elements.
			if ( isset( $element['elements'] ) && is_array( $element['elements'] ) ) {
				$this->findSurecartShortcodes( $element['elements'], $found_shortcodes );
			}
		}

		return $found_shortcodes;
	}
}

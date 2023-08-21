<?php
/**
 * @package   SureCartAppCore
 * @author    SureCart <support@surecart.com>
 * @copyright  SureCart
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCart\WordPress;

/**
 * Provides compatibility with other plugins.
 */
class CompatibilityService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// UAG fix.
		add_action( 'render_block_data', [ $this, 'maybeEnqueueUAGBAssets' ] );

		add_filter( 'surecart/shortcode/render', [ $this, 'maybeEnqueueUAGBAssetsForShortcode' ], 5, 4 );

	}

	/**
	 * Render block data.
	 *
	 * @param array $block_data Block data.
	 *
	 * @return array
	 */
	public function maybeEnqueueUAGBAssets( $parsed_block ) {
		// UAGB must be activated.
		if ( ! class_exists( '\UAGB_Post_Assets' ) ) {
			return $parsed_block;
		}

		// must be our checkout form block.
		if ( 'surecart/checkout-form' !== $parsed_block['blockName'] ) {
			return $parsed_block;
		}

		// must have an ID.
		if ( empty( $parsed_block['attrs']['id'] ) ) {
			return $parsed_block;
		}

		// If Spectra Blocks are present in the form, enqueue the assets.
		$post_assets_instance = new \UAGB_Post_Assets( $parsed_block['attrs']['id'] );
		$post_assets_instance->enqueue_scripts();

		return $parsed_block;
	}

	/**
	 * Filter SC Form Shortcode to load the Spectra Blocks Assets.
	 *
	 * @param string $output Content.
	 * @param array $attributes Shortcode attributes.
	 * @param string $name Shortcode Tag.
	 * @param object $form Form Post Object.
	 * 
	 *
	 * @return array
	 */
	public function maybeEnqueueUAGBAssetsForShortcode( $output, $attributes, $name, $form ) {
		// UAGB must be activated.
		if ( ! class_exists( '\UAGB_Post_Assets' ) ) {
			return $output;
		}

		// must be our form shortcode.
		if ( 'sc_form' !== $name ) {
			return $output;
		}

		// must have an ID.
		if ( empty( $attributes['id'] ) ) {
			return $output;
		}

		// If Spectra Blocks are present in the form, enqueue the assets.
		$post_assets_instance = new \UAGB_Post_Assets( $attributes['id'] );
		$post_assets_instance->enqueue_scripts();

		return $output;
	}
}

<?php

namespace SureCart\Integrations\Catalog;

/**
 * Kadence Cloud integration catalog listing.
 */
class KadenceCloud extends AbstractCatalogItem {
	/**
	 * The priority.
	 */
	public function getPriority() {
		return 0;
	}

	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/kadence-cloud';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'Kadence Cloud';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Design & Theme', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Access hundreds of pre-built templates and patterns to quickly create beautiful websites with Kadence Blocks.', 'surecart' );
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getDescription() {
		ob_start();
		?>
		<h2><?php esc_html_e( 'Overview', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Kadence Cloud provides access to a vast library of pre-built templates and patterns that work seamlessly with Kadence Blocks. Create professional websites quickly with ready-to-use designs.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart integrates with Kadence Cloud to provide pre-built e-commerce templates and patterns. Import ready-made designs for your product pages, checkout forms, and customer portals.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate Kadence Blocks, Kadence Cloud, and SureCart plugins. Access the template library through the block editor to start building your e-commerce pages with professional designs.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/kadence-cloud.svg' );
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'kadence-blocks';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'kadence-blocks/kadence-blocks.php';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'KADENCE_BLOCKS_VERSION' );
	}
}

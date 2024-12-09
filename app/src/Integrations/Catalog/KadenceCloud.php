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
		<p><?php esc_html_e( 'Sell access keys to Kadence Cloud and give your customers instant access to hundreds of premium templates, patterns, and design libraries for WordPress.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'SureCart seamlessly integrates with Kadence Cloud to automatically provision and deliver access keys to your customers after purchase. Customers can instantly access the Kadence Cloud library to build professional WordPress websites.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect your Kadence Cloud account, create your products in SureCart, and start selling access keys. Your customers will automatically receive their access credentials upon successful purchase.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the logo url for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/kadence.svg' );
	}

	/**
	 * Get if the integration is pre-installed.
	 *
	 * @return boolean
	 */
	public function getIsPreInstalled() {
		return true;
	}

	/**
	 * Get if the integration is enabled.
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return true;
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'Kadence Cloud';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://www.kadencewp.com/premium-support-tickets/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://www.kadencewp.com/help-center/docs/kadence-cloud/how-to-sell-access-keys-surecart/';
	}
}

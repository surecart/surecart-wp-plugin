<?php

namespace SureCart\Integrations\Catalog;

/**
 * SureDash integration catalog listing.
 */
class SureDash extends AbstractCatalogItem {
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
		return 'suredash';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'SureDash';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Community / Network', 'surecart' ), __( 'Courses & Online Learning', 'surecart' ), __( 'Recommended', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Integrate SureDash with SureCart to sell your online courses with a powerful checkout experience.', 'surecart' );
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
		<p><?php esc_html_e( 'SureDash is an all-in-one community platform that helps you connect, engage, and grow your online community while scaling your business.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect SureDash with SureCart to monetize your community. Sell memberships, access passes, and exclusive content through SureCart\'s optimized checkout process.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'When members purchase access through SureCart, they automatically gain entry to your community spaces and content, creating a seamless member experience.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Leverage SureCart\'s powerful features like multiple payment options, subscription management, and abandoned cart recovery to grow your community business.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both SureDash and SureCart plugins. Set up your customer dashboard in SureDash. Sell memberships, access passes, and exclusive content through SureCart\'s optimized checkout process.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the YouTube video ID for the integration.
	 *
	 * @return string
	 */
	public function getYouTubeVideoId() {
		return '7syWO6epxnE';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://suredash.com/';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suredash.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return is_plugin_active( 'suredash/suredash.php' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'SureDash';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://suredash.com/contact/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://suredash.com/';
	}

	/**
	 * Get docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://suredash.com/docs/';
	}
}

<?php

namespace SureCart\Integrations\Catalog;

/**
 * ThriveDesk integration catalog listing.
 */
class ThriveDesk extends AbstractCatalogItem {
	/**
	 * The priority.
	 *
	 * @return integer
	 */
	public function getPriority() {
		return 1;
	}

	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/thrivedesk';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'ThriveDesk';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Customer Experience', 'surecart' ) ];
	}

	/**
	 * Get the summary for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Streamline your customer support with ThriveDesk\'s powerful helpdesk solution.', 'surecart' );
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
		<p><?php esc_html_e( 'ThriveDesk is a modern helpdesk solution that helps you provide exceptional customer support.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect ThriveDesk with SureCart to automatically sync customer data and purchase information with your helpdesk.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'View complete customer purchase history and details right within your support tickets for better context and faster resolution.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Automate support workflows and provide faster, more personalized customer service with integrated customer data.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect your ThriveDesk account with SureCart to start syncing customer and purchase data automatically.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'thrivedesk';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/thrivedesk.png' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'ThriveDesk';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://help.thrivedesk.com';
	}

	/**
	 * Get the documentation link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://help.thrivedesk.com/en/surecart-integration';
	}

	/**
	 * Get the youtube id for the integration.
	 *
	 * @return string
	 */
	public function getYouTubeVideoId() {
		return 'fHQ9MIfDMMs';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://thrivedesk.com/';
	}

	/**
	 * Get the enable link for the integration.
	 *
	 * @return string
	 */
	public function getEnableLink() {
		return 'https://thrivedesk.com/';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return true;
	}

	/**
	 * Is the integration pre-installed?
	 *
	 * @return boolean
	 */
	public function getIsPreInstalled() {
		return true;
	}
}

<?php

namespace SureCart\Integrations\Catalog;

/**
 * LearnDash integration catalog listing.
 */
class SureTriggers extends AbstractCatalogItem {
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
		return 'suretriggers';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'SureTriggers';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Recommended', 'surecart' ), __( 'Automation', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'SureTriggers lets you connect SureCart to hundreds of apps and automate your workflows.', 'surecart' );
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
		<p><?php esc_html_e( 'SureTriggers is a powerful automation platform built in tandem to work with SureCart, allowing you to create sophisticated workflows and integrate with hundreds of popular apps.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'As a native integration, SureTriggers seamlessly connects with SureCart to automate your entire business workflow. Trigger actions based on customer purchases, subscription changes, abandoned carts, and more.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Connect SureCart with popular tools like email marketing platforms, CRMs, and membership sites. Send personalized emails, update customer records, and manage user access automatically based on SureCart activities.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Build powerful automation workflows without any coding knowledge. Use pre-built templates or create custom workflows that perfectly match your business needs.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both SureTriggers and SureCart plugins. Navigate to SureTriggers to start creating your automation workflows. Choose from dozens of pre-built SureCart triggers and actions, or create your own custom automation sequences.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'suretriggers';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'suretriggers/suretriggers.php';
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return is_plugin_active( 'suretriggers/suretriggers.php' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suretriggers-logo.svg' );
	}

	/**
	 * Get the youtube video id for the integration.
	 *
	 * @return string
	 */
	public function getYouTubeVideoId() {
		return 'im1AS07locA';
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'SureTriggers';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://suretriggers.com/support/';
	}

	/**
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://suretriggers.com/docs/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://suretriggers.com/';
	}
}

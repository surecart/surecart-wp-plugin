<?php

namespace SureCart\Integrations\Catalog;

/**
 * TutorLMS integration catalog listing.
 */
class TutorLMS extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/tutor';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'TutorLMS';
	}

	/**
	 * Get the category for the integration.
	 *
	 * @return string
	 */
	public function getCategories() {
		return [ __( 'Courses & Online Learning', 'surecart' ) ];
	}

	/**
	 * Get the description for the integration.
	 *
	 * @return string
	 */
	public function getSummary() {
		return __( 'Integrate TutorLMS with SureCart to sell your online courses with a powerful checkout experience.', 'surecart' );
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
		<p><?php esc_html_e( 'TutorLMS is a complete learning management system for WordPress that makes creating and selling online courses simple and efficient.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Connect TutorLMS with SureCart to provide a seamless course purchasing experience. Create and manage your courses in TutorLMS, then sell them through SureCart\'s optimized checkout process.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'When students purchase your courses through SureCart, they automatically gain access to their purchased content, creating a smooth onboarding experience.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Take advantage of SureCart\'s features like multiple payment options, subscription management, and abandoned cart recovery to boost your course sales.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both TutorLMS and SureCart plugins. Create your courses in TutorLMS, then create corresponding products in SureCart. In the SureCart product editor, select the TutorLMS integration and choose which course to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return 'tutor';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return 'tutor/tutor.php';
	}

	/**
	 * Get the logo URL for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/tutor.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'TUTOR_VERSION' );
	}

	/**
	 * Get the support name for the integration.
	 *
	 * @return string
	 */
	public function getSupportName() {
		return 'SureCart';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return 'https://surecart.com/support/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://www.themeum.com/product/tutor-lms/';
	}
}

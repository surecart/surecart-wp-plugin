<?php

namespace SureCart\Integrations\Catalog;

/**
 * LearnDash integration catalog listing.
 */
class LearnDash extends AbstractCatalogItem {
	/**
	 * Get the id for the integration.
	 *
	 * @return string
	 */
	public function getId() {
		return 'surecart/learndash';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'LearnDash';
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
		return __( 'Integrate LearnDash with SureCart to offer course access as a product.', 'surecart' );
	}

	/**
	 * Get the video id for the integration.
	 *
	 * @return string
	 */
	public function getYouTubeVideoId() {
		return 'SuUxSgbSPN4';
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
		<p><?php esc_html_e( 'LearnDash is a powerful learning management system that allows you to create and manage courses, lessons, and quizzes.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'How it works', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Seamlessly sell LearnDash courses and groups through SureCart to boost your course sales and simplify your checkout process. Create compelling course offerings with flexible pricing options including one-time payments and subscriptions.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'With SureCart\'s LearnDash integration, you can automatically grant access to your courses and groups immediately after purchase, creating a smooth experience for your students.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Leverage SureCart\'s powerful features like abandoned cart recovery, multiple payment methods, and subscription management to increase your course sales and provide a better experience for your students.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'Install and activate both LearnDash and SureCart plugins. Create your courses or groups in LearnDash, then create a new product in SureCart. In the product editor, select the LearnDash integration and choose which course or group to associate with your product.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Is the integration external?
	 *
	 * @return boolean
	 */
	public function getEnableLink() {
		return 'https://learndash.com/';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/learndash.svg' );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return defined( 'LEARNDASH_VERSION' );
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
	 * Get the docs link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return 'https://surecart.com/docs/learndash-courses-and-groups/';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return 'https://www.learndash.com/';
	}
}

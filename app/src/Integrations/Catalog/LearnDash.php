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
		return [ __( 'Online Learning', 'surecart' ) ];
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
		<p><?php esc_html_e( 'Range Check-ins reduce meeting load by keeping every team member informed and connected day-to-day. Check-in asynchronously on a personal and professional level so the whole team feels in sync, wherever you are.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'With the Linear and Range integration, you can pull Linear activity directly into your Range Check-ins.', 'surecart' ); ?></p>
		<p><?php esc_html_e( 'Once you’ve connected your Linear and Range workspaces, any Linear issues that you create, comment on, or update will appear in your Range sidebar as suggested items to include in your Check-in.', 'surecart' ); ?></p>

		<p><?php esc_html_e( 'Messages like “Completed” and “Assigned” will appear alongside Linear issues in Range when you make an update to one of your assigned issues.', 'surecart' ); ?></p>

		<h2><?php esc_html_e( 'Configure', 'surecart' ); ?></h2>
		<p><?php esc_html_e( 'In Range, visit Settings > Integrations and locate Linear. Click Set this up and complete the authorization step. Once you’ve connected your team’s Linear and Range workspaces, every team member will need to click Link under Settings > Integrations > Linear in Range to start syncing their Linear activity to Range.', 'surecart' ); ?></p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Is the integration external?
	 *
	 * @return boolean
	 */
	public function getIsExternal() {
		return true;
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

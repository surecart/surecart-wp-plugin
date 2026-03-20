<?php

namespace SureCart\Models;

/**
 * The integration listing model.
 */
class IntegrationCatalog extends ExternalApiModel {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'v1';

	/**
	 * Default query parameters
	 *
	 * @var array
	 */
	protected $default_query = [
		'_embed'     => true,
		'_fields'    => 'id,slug,title,content,_links.wp:featuredmedia,_embedded.wp:featuredmedia,_links.wp:term,_embedded.wp:term,acf',
		'acf_format' => 'standard',
		'per_page'   => 100,
	];

	/**
	 * Base URL
	 *
	 * @var string
	 */
	protected $base_url = 'https://integrations-catalog.surecart.com/';

	/**
	 * Get the activation type attribute.
	 *
	 * @return string
	 */
	public function getActivationTypeAttribute() {
		if ( $this->acf['is_pre_installed'] ) {
			return 'pre-installed';
		}
		if ( $this->acf['plugin_slug'] && $this->acf['plugin_file'] ) {
			return 'plugin';
		}
		if ( $this->acf['theme_slug'] && ! $this->acf['activation_link'] ) {
			return 'theme';
		}
		if ( $this->acf['activation_link'] ) {
			return 'external';
		}
		return null;
	}

	/**
	 * Get the button text attribute.
	 *
	 * @return string
	 */
	public function getButtonTextAttribute() {
		if ( 'pre-installed' === $this->status ) {
			return __( 'Pre-installed', 'surecart' );
		}
		if ( 'active' === $this->status ) {
			return __( 'Enabled', 'surecart' );
		}
		if ( in_array( $this->activation_type, [ 'plugin', 'theme' ], true ) ) {
			if ( 'inactive' === $this->status ) {
				return __( 'Activate', 'surecart' );
			}
			return __( 'Install & Activate', 'surecart' );
		}
		return __( 'Activate', 'surecart' );
	}

	/**
	 * Get the status attribute.
	 *
	 * @return string
	 */
	public function getStatusAttribute() {
		if ( $this->acf['is_pre_installed'] ) {
			return 'pre-installed';
		}
		if ( $this->is_enabled ) {
			return 'active';
		}
		if ( 'plugin' === $this->activation_type ) {
			if ( $this->is_plugin_installed && ! $this->is_plugin_active ) {
				return 'inactive';
			}
			if ( ! $this->is_plugin_installed ) {
				return 'not-installed';
			}
		}
		return 'inactive';
	}

	/**
	 * Get the is plugin installed attribute.
	 *
	 * @return bool
	 */
	public function getIsPluginInstalledAttribute() {
		if ( empty( $this->acf['plugin_file'] ) ) {
			return false;
		}

		$plugin_path = WP_PLUGIN_DIR . '/' . $this->acf['plugin_file'];
		return file_exists( $plugin_path );
	}

	/**
	 * Get the is plugin active attribute.
	 *
	 * @return bool
	 */
	public function getIsPluginActiveAttribute() {
		if ( 'pie-calendar' === $this->slug ) { // Since Pie Calendar Free & Pro plugin had same plugin file name we need to check if the pro plugin is active explicitly.
			return $this->isPieCalendarProPluginActive();
		}

		if ( empty( $this->acf['plugin_file'] ) ) {
			return false;
		}

		return is_plugin_active( $this->acf['plugin_file'] );
	}

	/**
	 * Get the is plugin active attribute.
	 *
	 * @return bool
	 */
	public function getIsThemeActiveAttribute() {
		if ( empty( $this->acf['theme_slug'] ) ) {
			return false;
		}

		return wp_get_theme()->get_template() === $this->acf['theme_slug'];
	}

	/**
	 * Get the is enabled attribute.
	 *
	 * @return bool
	 */
	public function getIsEnabledAttribute() {
		if ( $this->getIsThemeActiveAttribute() ) {
			return true;
		}
		if ( $this->getIsPluginActiveAttribute() ) {
			return true;
		}

		return false;
	}

	/**
	 * Get the logo URL.
	 *
	 * @return string
	 */
	public function getLogoUrlAttribute() {
		// svg first.
		if ( file_exists( SURECART_PLUGIN_DIR . '/images/integrations/' . $this->slug . '.svg' ) ) {
			return untrailingslashit( \SureCart::core()->assets()->getUrl() ) . '/images/integrations/' . $this->slug . '.svg';
		}

		// then png.
		if ( file_exists( SURECART_PLUGIN_DIR . '/images/integrations/' . $this->slug . '.png' ) ) {
			return untrailingslashit( \SureCart::core()->assets()->getUrl() ) . '/images/integrations/' . $this->slug . '.png';
		}

		// then fallback to the featured media.
		return $this->_embedded['wp:featuredmedia'][0]['media_details']['sizes']['medium']['source_url'] ?? $this->_embedded['wp:featuredmedia'][0]['source_url'] ?? '';
	}

	/**
	 * Is Pie Calendar Pro plugin active.
	 *
	 * @return bool
	 */
	public function isPieCalendarProPluginActive() {
		if ( ! function_exists( 'piecal_pro_classic_metabox' ) ) {
			return false;
		}

		return true;
	}
}

<?php

namespace SureCart\Models;

/**
 * The integration listing model.
 */
class IntegrationCatalog extends StaticFileModel {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'integrations';

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
	protected $base_url = 'https://surecart.com/wp-json/wp/v2/';

	/**
	 * Get the is plugin active attribute.
	 *
	 * @return bool
	 */
	public function getIsPluginActiveAttribute() {
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
}

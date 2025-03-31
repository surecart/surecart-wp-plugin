<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasPrice;
use SureCart\Support\Contracts\PageModel;

/**
 * Holds the data of the Upsell.
 */
class Upsell extends Model implements PageModel {
	use HasPrice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'upsells';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'upsell';

	/**
	 * Get the upsell template id.
	 *
	 * @return string
	 */
	public function getTemplateIdAttribute(): string {
		$template_id = $this->metadata->wp_template_id ?? '';
		// use a fallback for FSE.
		if ( wp_is_block_theme() ) {
			// if one is not set, or it's a php file, use the fallback.
			if ( empty( $template_id ) || false !== strpos( $template_id, '.php' ) ) {
				return 'surecart/surecart//single-upsell';
			}
		}
		return $template_id;
	}

	/**
	 * Get the bump template
	 *
	 * @return \WP_Template|false
	 */
	public function getTemplateAttribute() {
		$template = get_block_template( $this->getTemplateIdAttribute() );
		return ! empty( $template->content ) ? $template : get_block_template( 'surecart/surecart//single-upsell' );
	}

	/**
	 * Get the bump template id.
	 *
	 * @return string
	 */
	public function getTemplatePartIdAttribute(): string {
		return $this->metadata->wp_template_part_id ?? 'surecart/surecart//upsell-info';
	}

	/**
	 * Get the bump template part template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplatePartAttribute() {
		$template = get_block_template( $this->getTemplatePartIdAttribute(), 'wp_template_part' );
		if ( ! empty( $template->content ) ) {
			return $template;
		}
		return get_block_template( 'surecart/surecart//upsell-info' );
	}

	/**
	 * Get the bump permalink.
	 *
	 * @return string
	 */
	public function getPermalinkAttribute(): string {
		if ( empty( $this->attributes['id'] ) ) {
			return '';
		}
		// permalinks off.
		if ( ! get_option( 'permalink_structure' ) ) {
			return untrailingslashit( add_query_arg( 'sc_upsell_id', $this->id, get_home_url( null, '', 'rest' ) ) );
		}
		// permalinks on.
		return untrailingslashit( get_home_url( null, trailingslashit( \SureCart::settings()->permalinks()->getBase( 'upsell_page' ) ) . $this->id ) );
	}

	/**
	 * Get the page title.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute(): string {
		return $this->metadata->cta ?? $this->name ?? '';
	}

	/**
	 * Get the meta description.
	 *
	 * @return string
	 */
	public function getMetaDescriptionAttribute(): string {
		return $this->metadata->description ?? '';
	}
}

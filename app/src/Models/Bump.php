<?php

namespace SureCart\Models;

use SureCart\Support\Contracts\PageModel;

/**
 * Holds the data of the order bump.
 */
class Bump extends Model implements PageModel {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'bumps';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'bump';

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|false
	 */
	protected function create( $attributes = [] ) {
		if ( ! wp_is_block_theme() ) {
			$attributes['metadata'] = [
				...$attributes['metadata'] ?? [],
				'wp_template_id' => apply_filters( 'surecart/templates/bumps/default', 'pages/template-surecart-bump.php' ),
			];
		}

		return parent::create( $attributes );
	}

	/**
	 * Get the bump template id.
	 *
	 * @return string
	 */
	public function getTemplateIdAttribute(): string {
		if ( ! empty( $this->attributes['metadata']->wp_template_id ) ) {
			// we have a php file, switch to default.
			if ( wp_is_block_theme() && false !== strpos( $this->attributes['metadata']->wp_template_id, '.php' ) ) {
				return 'surecart/surecart//single-bump';
			}

			// this is acceptable.
			return $this->attributes['metadata']->wp_template_id;
		}
		return 'surecart/surecart//single-bump';
	}
	/**
	 * Get the bump template
	 *
	 * @return \WP_Template
	 */
	public function getTemplateAttribute() {
		return get_block_template( $this->getTemplateIdAttribute() );
	}

	/**
	 * Get the bump template id.
	 *
	 * @return string
	 */
	public function getTemplatePartIdAttribute(): string {
		if ( ! empty( $this->attributes['metadata']->wp_template_part_id ) ) {
			return $this->attributes['metadata']->wp_template_part_id;
		}
		return 'surecart/surecart//bump-info';
	}

	/**
	 * Get the bump template part template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplatePartAttribute() {
		return get_block_template( $this->getTemplatePartIdAttribute(), 'wp_template_part' );
	}

	/**
	 * Get Template Content.
	 *
	 * @return string
	 */
	public function getTemplateContent() : string {
		return wp_is_block_theme() ?
			$this->template->content ?? '' :
			$this->template_part->content ?? '';
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
			return add_query_arg( 'sc_bump_id', $this->id, get_home_url() );
		}
		// permalinks on.
		return trailingslashit( get_home_url() ) . trailingslashit( \SureCart::settings()->permalinks()->getBase( 'bump_page' ) ) . $this->id;
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

	/**
	 * Get the JSON Schema Array
	 *
	 * @return array
	 */
	public function getJsonSchemaArray(): array {
		return [];
	}
}

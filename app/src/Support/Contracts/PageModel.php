<?php

namespace SureCart\Support\Contracts;

interface PageModel {
	/**
	 * Get the page title attribute.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute() : string;

	/**
	 * Get the page descriptoin attribute
	 *
	 * @return string
	 */
	public function getMetaDescriptionAttribute(): string;

	/**
	 * Get the page permalink attribute
	 *
	 * @return string
	 */
	public function getPermalinkAttribute(): string;

	/**
	 * Get the template id.
	 *
	 * @return string|false
	 */
	public function getTemplateIdAttribute(): string;

	/**
	 * Get the template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplateAttribute();

	/**
	 * Get the template id.
	 *
	 * @return string|false
	 */
	public function getTemplatePartIdAttribute(): string;

	/**
	 * Get the template part template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplatePartAttribute();

	/**
	 * Must return a schema array.
	 *
	 * @return array
	 */
	public function getJsonSchemaArray(): array;
}

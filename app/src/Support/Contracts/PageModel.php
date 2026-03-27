<?php

namespace SureCart\Support\Contracts;

interface PageModel {
	/**
	 * Get the page title attribute.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute(): string;

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
	 * @return string
	 */
	public function getTemplateIdAttribute(): string;

	/**
	 * Get the template id.
	 *
	 * @return string
	 */
	public function getTemplatePartIdAttribute(): string;
}

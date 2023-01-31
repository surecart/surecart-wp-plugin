<?php

namespace SureCart\WordPress\PostTypes;

use SureCart\WordPress\Pages\PageService;

/**
 * Form post type service class.
 */
class TemplateTypeService {
	/**
	 * Holds the page service
	 *
	 * @var PageService
	 */
	protected $page_service;

	/**
	 * Get the page service from the application container.
	 *
	 * @param PageService $page_service Page serice.
	 */
	public function __construct( PageService $page_service ) {
		$this->page_service = $page_service;
	}
}

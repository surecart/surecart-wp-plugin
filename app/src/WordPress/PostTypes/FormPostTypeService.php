<?php

namespace CheckoutEngine\WordPress\PostTypes;

use CheckoutEngine\WordPress\PageService;

/**
 * Form post type service class.
 */
class FormPostTypeService {
	/**
	 * Holds the page service
	 *
	 * @var PageService
	 */
	protected $page_service;

	/**
	 * The default form name.
	 *
	 * @var string
	 */
	protected $default_form_name = 'checkout';

	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $post_type = 'ce_form';

	/**
	 * Group Prefix
	 *
	 * @var string
	 */
	protected $group_prefix = 'ce-checkout-';

	/**
	 * Get the page service from the application container.
	 *
	 * @param PageService $page_service Page serice.
	 */
	public function __construct( PageService $page_service ) {
		$this->page_service = $page_service;
	}

	/**
	 * Find a form by its option name.
	 *
	 * @param string $option Option name.
	 * @return WP_Post|null
	 */
	public function findByOptionName( $option ) {
		return $this->page_service->get( $option, 'ce_form' );
	}

	/**
	 * Find a form by id.
	 *
	 * @param integer $id Post id.
	 * @return WP_Post|null
	 */
	public function findById( $id ) {
		return get_post( $id );
	}

	/**
	 * Get the default checkout form post.
	 *
	 * @return WP_Post|null
	 */
	public function getDefault() {
		return $this->findByOptionName( $this->default_form_name );
	}

	/**
	 * Get the default group id.
	 *
	 * @return string.
	 */
	public function getDefaultGroupId() {
		$form = $this->getDefault();
		return $this->group_prefix . (int) $form->ID;
	}
}

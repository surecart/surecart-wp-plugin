<?php

namespace SureCart\Routing;

/**
 * Generates links for specific amdin urls.
 */
class AdminURLService {
	/**
	 * Stores the admin page names.
	 *
	 * @var array
	 */
	protected $page_names = [];

	/**
	 * Initialize page names
	 *
	 * @param array $page_names Array of page names and their admin query names.
	 */
	public function __construct( $page_names ) {
		$this->page_names = $page_names;
	}

	/**
	 * New page url
	 *
	 * @param string $name Model lowercase name.
	 * @return string URL for the page.
	 */
	public function new( $name ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'edit',
				],
				menu_page_url( $this->page_names[ $name ], false )
			)
		);
	}

	/**
	 * Edit page url
	 *
	 * @param string $name Model lowercase name.
	 * @param string $id Model id.
	 *
	 * @return string URL for the page.
	 */
	public function edit( $name, $id = null ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'edit',
					'id'     => $id,
				],
				menu_page_url( $this->page_names[ $name ] ?? '', false )
			)
		);
	}

	/**
	 * Show page url
	 *
	 * @param string $name Model lowercase name.
	 * @param string $id Model id.
	 *
	 * @return string URL for the page.
	 */
	public function show( $name, $id = null ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'show',
					'id'     => $id,
				],
				menu_page_url( $this->page_names[ $name ] ?? '', false )
			)
		);
	}

	/**
	 * Admin index page url
	 *
	 * @param string $name Model lowercase name.
	 * @return string URL for the page.
	 */
	public function index( $name ) {
		return esc_url( menu_page_url( $this->page_names[ $name ], false ) );
	}

	/**
	 * Archive page url
	 *
	 * @param string $name Model lowercase name.
	 * @param string $id Model id.
	 *
	 * @return string URL for the page.
	 */
	public function toggleArchive( $name, $id ) {
		return esc_url(
			add_query_arg(
				[
					'action' => 'toggle_archive',
					'nonce'  => wp_create_nonce( "archive_$name" ),
					'id'     => $id,
				],
				$this->index( $name )
			)
		);
	}

	/**
	 * Edit model action
	 */
	public function editModel( $action, $id, $redirect_url = '' ) {
		return esc_url(
			add_query_arg(
				[
					'action' => $action,
					'nonce'  => wp_create_nonce( $action ),
					'id'     => $id,
				],
				$redirect_url
			)
		);
	}

	/**
	 * Build the checkout url.
	 *
	 * @param array $line_items Line items.
	 * @return string url
	 */
	public function checkout( $line_items = [] ) {
		return add_query_arg(
			[
				...( $line_items ? [ 'line_items' => $this->lineItems( $line_items ?? [] ) ] : [] ),
			],
			\SureCart::pages()->url( 'checkout' )
		);
	}

	/**
	 * Build the line items array.
	 *
	 * @param array $line_items Line items.
	 * @return array Line items.
	 */
	public function lineItems( $line_items ) {
		return array_map(
			function( $item ) {
				return [
					'price_id' => $item['id'],
					'quantity' => $item['quantity'],
				];
			},
			$line_items ?? []
		);
	}
}

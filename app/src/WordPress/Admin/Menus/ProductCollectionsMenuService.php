<?php

namespace SureCart\WordPress\Admin\Menus;

use SureCart\Models\ProductCollection;

/**
 * Service for product collection pages in WordPress menu related functions.
 */
class ProductCollectionsMenuService {
	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'render_block', [ $this, 'filterMenuBlockLinkHref' ], 10, 2 );
	}

	/**
	 * If the menu item is a collection page, add the collection slug to the menu item..
	 *
	 * @param string $content Block content.
	 * @param array  $block_data Block data.
	 *
	 * @return array
	 */
	public function filterMenuBlockLinkHref( $content, $block_data ) {
		// not a navigation link.
		if ( empty( $block_data['blockName'] ) || 'core/navigation-link' !== $block_data['blockName'] ) {
			return $content;
		}
		// don't have kind.
		if ( empty( $block_data['attrs']['kind'] ) || 'sc-collection' !== $block_data['attrs']['kind'] ) {
			return $content;
		}
		// don't have an id.
		if ( empty( $block_data['attrs']['id'] ) ) {
			return $content;
		}

		$collection = ProductCollection::find( $block_data['attrs']['id'] );

		if ( ! $collection || empty( $collection ) || empty( $collection->slug ) ) {
			return $content;
		}

		$collection_slug = $collection->slug;

		$new_link = esc_url_raw( trailingslashit( get_home_url() ) . trailingslashit( \SureCart::settings()->permalinks()->getBase( 'collection_page' ) ) . $collection_slug );

		return preg_replace( '/href="([^"]*)"/', 'href="' . $new_link . '"', $content );
	}
}

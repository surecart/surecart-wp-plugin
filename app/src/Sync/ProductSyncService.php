<?php


namespace SureCart\Sync;

use SureCart\Models\Product;

/**
 * Syncs customer records to WordPress users.
 */
class ProductSyncService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/product';

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( $this->action_name, [ $this, 'sync' ], 10, 2 );
	}

	/**
	 * Is this sync running.
	 *
	 * @return boolean
	 */
	public function isScheduled() {
		return \SureCart::queue()->isScheduled( $this->action_name );
	}

	/**
	 * Has this product been synced recently.
	 *
	 * @param string $id The product id to check.
	 * @param string $time_ago The time ago to check.
	 *
	 * @return boolean
	 */
	public function hasRecentlySynced( $id, $time_ago = '-5 minutes' ) {
		// get the last sync.
		$last_sync = \SureCart::queue()->search(
			[
				'hook'         => $this->action_name,
				'args'         => [ 'id' => $id ],
				'date_compare' => '<', // before the time ago.
				'date'         => strtotime( $time_ago ), // 5 minutes ago.
				'per_page'     => 1, // only need one.
			],
			'ids' // return only the ids (more efficient).
		);

		return ! empty( $last_sync );
	}

	/**
	 * Sync product.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @return void
	 */
	public function sync( $id ) {
		// is scheduled or has recently synced.
		// this prevents multiple syncs from happening at the same time
		// or rapid syncing of products due to unforeseen circumstances.
		if ( $this->isScheduled() || $this->hasRecentlySynced( $id ) ) {
			return;
		}

		// get product.
		$product = Product::with( [ 'prices', 'variants', 'variant_options', 'product_medias', 'product_media.media' ] )->get( $id );

		// handle error.
		if ( is_wp_error( $product ) ) {
			return $product;
		}

		// sync the product.
		return $product->sync();
	}
}

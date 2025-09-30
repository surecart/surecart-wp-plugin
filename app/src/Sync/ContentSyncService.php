<?php

namespace SureCart\Sync;

use SureCart\Models\Import;

/**
 * Syncs the content for a given sync key.
 */
class ContentSyncService {
	/**
	 * The application container.
	 *
	 * @var \SureCart\Application
	 */
	protected $app;

	/**
	 * The sync key.
	 *
	 * @var string
	 */
	protected const SYNC_KEY = 'surecart_import_content_sync';

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Bootstrap the service.
	 */
	public function bootstrap() {
		// set the content when the product is first synced.
		add_filter( 'surecart/product/sync/created/props', [ $this, 'setContent' ], 10, 2 );
		// when the import is created, set a check to make sure products are synced.
		add_action( 'surecart/models/productimport/created', [ $this, 'setContentBatch' ], 10 );
		// check the batch, if there is content to sync, sync those products.
		add_action( 'admin_init', [ $this, 'maybeCheckImport' ] );
	}

	/**
	 * Get the batch service.
	 *
	 * @return BatchCheckService
	 */
	protected function batch() {
		return $this->app->resolve( 'surecart.sync.batch' );
	}

	/**
	 * Get the sync service.
	 *
	 * @return ProductsSyncService
	 */
	protected function sync() {
		return $this->app->resolve( 'surecart.sync.products' );
	}

	/**
	 * Check if there are any imports to check.
	 *
	 * @return array|bool|\WP_Error
	 */
	public function maybeCheckImport() {
		$imports = $this->batch()->getByPrefix( self::SYNC_KEY );

		// there are no imports to check.
		if ( empty( $imports ) ) {
			return false;
		}

		foreach ( $imports as $import_id ) {
			// find the import.
			$import = Import::find( $import_id );

			// There was an error.
			if ( is_wp_error( $import ) ) {
				return false;
			}

			// The import is not invalid or completed, don't check it .
			if ( ! in_array( $import->status, [ 'invalid', 'completed' ], true ) ) {
				\SureCart::notices()->add(
					[
						'type'  => 'info',
						'title' => esc_html__( 'SureCart bulk action progress status.', 'surecart' ),
						'text'  => '<p>' . esc_html__( 'The product import failed. Please try again.', 'surecart' ) . '</p>',
					]
				);
				return false;
			}

			// Remove the batch check.
			$this->removeContentBatch( $import );

			// already syncing.
			if ( $this->sync()->isActive() ) {
				return false;
			}

			// dispatch the sync.
			return $this->sync()->dispatch();
		}

		return false;
	}

	/**
	 * Set the content.
	 *
	 * @param array                  $props The props.
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	public function setContent( $props, \SureCart\Models\Model $model ) {
		if ( ! isset( $model->metadata->sc_initial_sync_pattern ) ) {
			return $props;
		}

		$post = get_post( $model->metadata->sc_initial_sync_pattern );

		// We no longer need the pattern.
		if ( isset( $post->ID ) ) {
			wp_delete_post( $post->ID, true );
		}

		// Return the props with the post content.
		return array_merge( $props, [ 'post_content' => $post->post_content ?? '' ] );
	}

	/**
	 * Set a check to make sure products are synced.
	 *
	 * @param \SureCart\Models\Import $import The import.
	 */
	public function setContentBatch( $import ) {
		$this->batch()->set( self::SYNC_KEY . $import->id, $import->id );
	}

	/**
	 * Remove the check to make sure products are synced.
	 *
	 * @param \SureCart\Models\Import $import The import.
	 */
	public function removeContentBatch( $import ) {
		$this->batch()->remove( self::SYNC_KEY . $import->id );
	}
}

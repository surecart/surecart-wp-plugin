<?php

namespace SureCart\Sync;

/**
 * Syncs the content for a given sync key.
 */
class ContentSyncService {
	/**
	 * The sync key.
	 *
	 * @var \SureCart\Application
	 */
	protected $app;

	/**
	 * The sync key.
	 *
	 * @var string
	 */
	protected const SYNC_KEY = 'surecart_content_sync_key';

	/**
	 * The batch prefix.
	 *
	 * @var string
	 */
	protected const BATCH_PREFIX = 'sc_content_batch_';

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
		add_action( 'surecart/product/sync/created/props', [ $this, 'setContent' ], 10, 2 );
		// set the content when the import is complete.
		add_action( 'surecart/import/content', [ $this, 'maybeStageContentSync' ], 10 );
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
	 * Generate a unique id.
	 *
	 * @return string
	 */
	protected function generateUniqueId() {
		return self::BATCH_PREFIX . wp_generate_uuid4();
	}

	/**
	 * Get the unique id.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return string
	 */
	protected function getUniqueId( $model ) {
		return self::BATCH_PREFIX . $model->metadata->{self::SYNC_KEY};
	}

	/**
	 * Check if there are any imports to check.
	 *
	 * @return array|WP_Error
	 */
	public function maybeCheckImport() {
		$import = $this->batch()->getByPrefix( self::BATCH_PREFIX );

		// there are not imports to check.
		if ( empty( $import ) ) {
			return false;
		}

		// already syncing.
		if ( \SureCart::sync()->products()->isActive() ) {
			return false;
		}

		// dispatch the sync.
		// return \SureCart::sync()->products()->dispatch();
	}

	/**
	 * Set the content.
	 *
	 * @param array                  $props The props.
	 * @param \SureCart\Models\Model $model The model.
	 */
	public function setContent( $props, \SureCart\Models\Model $model ) {
		// get the unique id.
		$id = $this->getUniqueId( $model );

		// get the content.
		$content = $this->batch()->get( $id );

		if ( $content ) {
			$this->batch()->remove( $id );
			return array_merge( $props, array( 'post_content' => $content ) );
		}

		return $props;
	}

	/**
	 * Set the sync key.
	 *
	 * @param array $model_data The model data.
	 *
	 * @return \SureCart\Models\Model
	 */
	public function maybeStageContentSync( $model_data = [] ) {
		// bail if no content.
		if ( empty( $model_data['content'] ) ) {
			return $model_data;
		}

		// generate a unique uuid.
		$unique_id = $this->generateUniqueId();

		// set the sync key in the metadata.
		$model_data['metadata'][ self::SYNC_KEY ] = $unique_id;

		// set the sync key in the batch.
		$this->batch()->set( $unique_id, $model_data['content'] );

		// return the model data.
		return $model_data;
	}
}

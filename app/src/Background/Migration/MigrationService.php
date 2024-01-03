<?php
namespace SureCart\Background\Migration;

use SureCart\Models\Price;
use SureCart\Models\Product;
use SureCart\Models\ProductMedia;
use SureCart\Models\Variant;
use SureCart\Models\VariantOption;

/**
 * The migration service.
 */
class MigrationService {
	/**
	 * The model fetch process.
	 *
	 * @var ModelFetchJob
	 */
	protected $fetch;

	/**
	 * The model sync process.
	 *
	 * @var ModelSyncJob
	 */
	protected $sync;

	/**
	 * Initialize the migration service.
	 *
	 * @param ModelFetchJob $fetch The model fetch job.
	 * @param ModelSyncJob  $sync  The model sync job.
	 */
	public function __construct( ModelFetchJob $fetch, ModelSyncJob $sync ) {
		$this->fetch = $fetch;
		$this->sync  = $sync;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showMigrationNotice' ] );
	}

	/**
	 * Sync all.
	 *
	 * @return BackgroundProcess
	 */
	public function models() {
		// this one needs it's own batch so they process in order.
		$this->fetch->push_to_queue( [ 'model' => Product::class ] )->save();
		$this->fetch->push_to_queue( [ 'model' => ProductMedia::class ] )->save();
		$this->fetch->push_to_queue( [ 'model' => Price::class ] )->save();
		$this->fetch->push_to_queue( [ 'model' => Variant::class ] )->save();
		$this->fetch->push_to_queue( [ 'model' => VariantOption::class ] )->save();
		return $this->fetch;
	}

	/**
	 * Get the model fetch job.
	 *
	 * @return ModelFetchJob
	 */
	public function fetch() {
		return $this->fetch;
	}

	/**
	 * Get the model sync job.
	 *
	 * @return ModelSyncJob
	 */
	public function sync() {
		return $this->sync;
	}

	/**
	 * Show the migration notice.
	 *
	 * @return void
	 */
	public function showMigrationNotice() {
		if ( ! $this->isActive() ) {
			return;
		}
		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'type'  => 'info',
					'title' => esc_html__( 'SureCart Product Sync In Progress', 'surecart' ),
					'text'  => wp_sprintf(
						'<p>%s</p>
						<p><a href="%s" class="button button-secondary" id="surecart-migration-cancel">%s</a></p>',
						esc_html__( 'SureCart is syncing products in the background. The process may take a little while, so please be patient.', 'surecart' ),
						esc_url(
							add_query_arg(
								[
									'action' => 'cancel_sync_products',
									'nonce'  => wp_create_nonce( 'cancel_sync_products' ),
								],
							)
						),
						esc_html__( 'Cancel', 'surecart' )
					),
				]
			)
		);
	}

	/**
	 * Check if the migration is active.
	 *
	 * @return bool
	 */
	public function isActive() {
		if ( $this->fetch->is_active() ) {
			return 'fetch';
		}
		if ( $this->sync->is_active() ) {
			return 'sync';
		}
		return false;
	}

	/**
	 * Cancel all.
	 *
	 * @return void
	 */
	public function cancel() {
		$this->fetch->cancel();
		$this->sync->cancel();
	}

	/**
	 * Delete all.
	 *
	 * @return void
	 */
	public function deleteAll() {
		$this->fetch->delete_all();
		$this->sync->delete_all();
	}
}

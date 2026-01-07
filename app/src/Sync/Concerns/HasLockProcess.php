<?php

namespace SureCart\Sync\Concerns;

/**
 * Provides transient-based locking for sync operations.
 */
trait HasLockProcess {
	/**
	 * The lock prefix.
	 *
	 * @var string
	 */
	protected $lock_prefix = 'sc_sync_lock';

	/**
	 * Get the lock key.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return string
	 */
	protected function getLockKey( \SureCart\Models\Model $model ): string {
		return "{$this->lock_prefix}_{$model->id}";
	}

	/**
	 * Check if the lock exists.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return bool
	 */
	protected function hasLock( \SureCart\Models\Model $model ): bool {
		return false !== get_transient( $this->getLockKey( $model ) );
	}

	/**
	 * Acquire the lock.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return bool
	 */
	protected function acquireLock( \SureCart\Models\Model $model ): bool {
		$max_execution_time = (int) ini_get( 'max_execution_time' );
		$expiration         = $max_execution_time > 0 ? $max_execution_time : 30;
		return set_transient( $this->getLockKey( $model ), time(), $expiration );
	}

	/**
	 * Release the lock.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return bool
	 */
	protected function releaseLock( \SureCart\Models\Model $model ): bool {
		return (bool) delete_transient( $this->getLockKey( $model ) );
	}
}

<?php

namespace SureCart\Sync;

/**
 * Manages the batch check items.
 *
 * Allows storing and retrieving batch check items in a single transient.
 */
class BatchCheckService {
	/**
	 * The app.
	 *
	 * @var \SureCart\App
	 */
	protected const BATCH_CHECK_TRANSIENT = 'surecart_batches_check';

	/**
	 * The batch check transient expiration.
	 *
	 * @var int
	 */
	protected const BATCH_CHECK_TRANSIENT_EXPIRATION = 10 * MINUTE_IN_SECONDS;

	/**
	 * Get the batch check items.
	 *
	 * @param string $id The id of the batch (optional).
	 *
	 * @return mixed
	 */
	public function get( $id = '' ) {
		$items = array_filter( (array) get_transient( self::BATCH_CHECK_TRANSIENT ) );

		if ( ! empty( $id ) ) {
			return $items[ $id ] ?? false;
		}

		return $items;
	}

	/**
	 * Set the batch check item.
	 *
	 * @param string $id The id of the batch.
	 * @param mixed  $item The item to set.
	 *
	 * @return boolean
	 */
	public function set( $id, $item ) {
		$items        = $this->get();
		$items[ $id ] = $item;
		return set_transient( self::BATCH_CHECK_TRANSIENT, array_filter( $items ), self::BATCH_CHECK_TRANSIENT_EXPIRATION );
	}

	/**
	 * Remove the batch check item.
	 *
	 * @param string $id The id of the batch.
	 */
	public function remove( $id ) {
		$items = $this->get();

		// remove the item.
		unset( $items[ $id ] );

		// if there are no items, delete the transient.
		return empty( $items ) ?
			delete_transient( self::BATCH_CHECK_TRANSIENT ) :
			set_transient( self::BATCH_CHECK_TRANSIENT, array_filter( $items ), self::BATCH_CHECK_TRANSIENT_EXPIRATION );
	}


	/**
	 * Get the batches by prefix.
	 *
	 * @param string $prefix The prefix.
	 *
	 * @return array
	 */
	public function getByPrefix( $prefix ) {
		$items = $this->get();
		return array_filter(
			$items,
			function ( $item, $key ) use ( $prefix ) {
				return strpos( $key, $prefix ) === 0;
			},
			ARRAY_FILTER_USE_BOTH
		);
	}
}

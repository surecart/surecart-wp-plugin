<?php

namespace SureCart\Sync;

/**
 * Centralized state management for background import processes.
 *
 * Encapsulates WordPress options and transients used to track import progress
 * across background job batches. Designed to be reusable for different import
 * types (WooCommerce, Shopify, EDD, etc.) via the $type constructor parameter.
 *
 * Key prefixing: all storage keys follow the pattern sc_{type}_import_{suffix}.
 *
 * Note: Not concurrency-safe. Relies on the single-import constraint
 * (only one import of a given type runs at a time, enforced by isRunning()).
 */
final class ImportState {

	/**
	 * Import type prefix, e.g. 'woo' → keys are sc_woo_import_*.
	 *
	 * @var string
	 */
	private string $type;

	/**
	 * Constructor.
	 *
	 * @param string $type Import type prefix (e.g. 'woo').
	 */
	public function __construct( string $type ) {
		$this->type = $type;
	}

	/**
	 * Build a prefixed storage key.
	 *
	 * @param string $suffix Key suffix (e.g. 'ids', 'session_id', 'all_skipped').
	 *
	 * @return string Full key like 'sc_woo_import_ids'.
	 */
	private function key( string $suffix ): string {
		return "sc_{$this->type}_import_{$suffix}";
	}

	// --- Session ---

	/**
	 * Get or create the session ID for this import run.
	 * Matches current behavior: lazy session creation on first call.
	 *
	 * @return string Session ID (UUID).
	 */
	public function getOrCreateSessionId(): string {
		$session_id = get_option( $this->key( 'session_id' ) );
		if ( ! $session_id ) {
			$session_id = wp_generate_uuid4();
			update_option( $this->key( 'session_id' ), $session_id, false );
		}
		return $session_id;
	}

	/**
	 * Get the current session ID without creating one.
	 *
	 * @return string|null Session ID or null if not set.
	 */
	public function getSessionId(): ?string {
		$session_id = get_option( $this->key( 'session_id' ) );
		return $session_id ? $session_id : null;
	}

	// --- Result IDs ---

	/**
	 * Append an import batch ID to the accumulated results.
	 *
	 * Not concurrency-safe: read-modify-write. Safe under single-import constraint (isRunning() guard).
	 *
	 * @param string $id The import ID to append.
	 *
	 * @return void
	 */
	public function appendResultId( string $id ): void {
		$existing_ids   = get_option( $this->key( 'ids' ), [] );
		$existing_ids[] = sanitize_key( $id );
		update_option( $this->key( 'ids' ), $existing_ids, false );
	}

	/**
	 * Get all accumulated import result IDs.
	 *
	 * @return array Array of import IDs.
	 */
	public function getResultIds(): array {
		return get_option( $this->key( 'ids' ), [] );
	}

	// --- Skipped items (transient, 7-day TTL) ---

	/**
	 * Merge skipped items into the session's transient.
	 *
	 * Session is lazily created here to match existing behavior where the first
	 * batch with skipped items creates the session.
	 *
	 * @param array $items Array of skipped item data.
	 *
	 * @return void
	 */
	public function addSkippedItems( array $items ): void {
		if ( empty( $items ) ) {
			return;
		}

		$session_id    = $this->getOrCreateSessionId();
		$transient_key = $this->key( 'skipped_' ) . $session_id;

		// Merge with any previously stored skipped items from earlier batches.
		$existing = get_transient( $transient_key );
		if ( ! is_array( $existing ) ) {
			$existing = [];
		}

		set_transient( $transient_key, array_merge( $existing, $items ), 7 * DAY_IN_SECONDS );
	}

	/**
	 * Get skipped items for the current session.
	 *
	 * @return array Array of skipped items, or empty array if no session exists.
	 */
	public function getSkippedItems(): array {
		$session_id = $this->getSessionId();
		if ( ! $session_id ) {
			return [];
		}
		return $this->getSkippedItemsBySession( $session_id );
	}

	/**
	 * Get skipped items by arbitrary session ID.
	 *
	 * @param string $session_id The session ID to look up.
	 *
	 * @return array Array of skipped items.
	 */
	public function getSkippedItemsBySession( string $session_id ): array {
		$transient_key = $this->key( 'skipped_' ) . $session_id;
		$items         = get_transient( $transient_key );
		return is_array( $items ) ? $items : [];
	}

	// --- All-skipped flag ---

	/**
	 * Mark this import as all-skipped (stores current session ID).
	 *
	 * @return void
	 */
	public function markAllSkipped(): void {
		$session_id = $this->getOrCreateSessionId();
		update_option( $this->key( 'all_skipped' ), $session_id, false );
	}

	/**
	 * Check if all products were skipped.
	 *
	 * @return bool
	 */
	public function isAllSkipped(): bool {
		return (bool) get_option( $this->key( 'all_skipped' ) );
	}

	/**
	 * Get the session ID stored in the all-skipped flag.
	 *
	 * @return string|null Session ID or null if not set.
	 */
	public function getAllSkippedSessionId(): ?string {
		$session_id = get_option( $this->key( 'all_skipped' ) );
		return $session_id ? $session_id : null;
	}

	// --- Lifecycle ---

	/**
	 * Clear all option-based state.
	 *
	 * Deletes sc_{type}_import_ids, sc_{type}_import_session_id, sc_{type}_import_all_skipped.
	 *
	 * Only deletes options, not transients. Skipped items transient expires via 7-day TTL.
	 * This matches the current dispatch() and importResults() cleanup behavior.
	 *
	 * @return void
	 */
	public function reset(): void {
		delete_option( $this->key( 'ids' ) );
		delete_option( $this->key( 'session_id' ) );
		delete_option( $this->key( 'all_skipped' ) );
	}
}

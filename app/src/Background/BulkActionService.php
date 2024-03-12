<?php


namespace SureCart\Background;

use SureCart\Models\BulkAction;

/**
 * Handled the business logic for Bulk Actions.
 */
class BulkActionService {

	public $bulk_actions_data = [];
	public $bulk_actions      = [];
	public $statuses          = array( 'succeeded', 'processing', 'pending', 'invalid', 'completed' );

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		$this->bulk_actions = ! empty( $_COOKIE['sc_bulk_actions'] ) ? json_decode( stripslashes( $_COOKIE['sc_bulk_actions'] ), true ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! empty( $this->bulk_actions ) ) {
			$this->setBulkActionsData();
			$this->deleteSucceededBulkActions();
		}
	}

	/**
	 * Get the bulk actions data.
	 */
	public function setBulkActionsData() {
		$bulk_actions = array();

		if ( is_array( $this->bulk_actions ) ) {
			$bulk_actions_expanded = BulkAction::where(
				[
					'ids[]' => $this->bulk_actions,
				]
			)->get();

			foreach ( $bulk_actions_expanded as $bulk_action ) {
				foreach ( $this->statuses as $status ) {
					if ( ! isset( $bulk_actions[ $bulk_action->action_type ][ $status . '_record_ids' ] ) ) {
						$bulk_actions[ $bulk_action->action_type ][ $status . '_record_ids' ] = array();
					}
					if ( ! isset( $bulk_actions[ $bulk_action->action_type ][ $status . '_bulk_actions' ] ) ) {
						$bulk_actions[ $bulk_action->action_type ][ $status . '_bulk_actions' ] = array();
					}
				}
				if ( ! is_wp_error( $bulk_action ) ) {
					$bulk_actions[ $bulk_action->action_type ][ $bulk_action->status ][] = $bulk_action;
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_bulk_actions' ], $bulk_action->id );
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_record_ids' ], ...$bulk_action->record_ids );
				}
			}
		}
		$this->bulk_actions_data = $bulk_actions;
	}

	/**
	 * Delete succeeded bulk actions from the cookie.
	 */
	public function deleteSucceededBulkActions() {
		$this->bulk_actions = array_filter(
			$this->bulk_actions,
			function( $bulk_action_id ) {
				return ! in_array(
					$bulk_action_id,
					$this->bulk_actions_data['delete_products']['succeeded_bulk_actions'] ?? [],
					true
				);
			}
		);
		setcookie(
			'sc_bulk_actions',
			wp_json_encode( $this->bulk_actions ),
			time() + DAY_IN_SECONDS,
			COOKIEPATH,
			COOKIE_DOMAIN,
			is_ssl(),
			true
		);
	}

	/**
	 * Show the bulk action admin notice.
	 *
	 * @param string $action_type The action type.
	 *
	 * @return void
	 */
	public function showBulkActionAdminNotice( $action_type = null ) {
		if ( empty( $action_type ) ) {
			return;
		}

		$status_parts = [];
		foreach ( $this->statuses as $status ) {
			$count = count( $this->bulk_actions_data[ $action_type ][ $status . '_record_ids' ] ?? [] );
			if ( $count > 0 ) {
				// translators: %1$d is Count of specific deletions, %2$s is bulk deletion progress status.
				$status_parts[] = sprintf( esc_html__( '%1$d %2$s', 'surecart' ), $count, $status );
			}
		}

		if ( ! empty( $status_parts ) ) {
			$status_summary = esc_html__( 'Bulk Action Summary:', 'surecart' ) . ' ' . implode( ', ', $status_parts ) . '.';
			echo wp_kses_post(
				\SureCart::notices()->render(
					[
						'type'  => 'info',
						'title' => esc_html__( 'SureCart bulk action progress status.', 'surecart' ),
						'text'  => '<p>' . $status_summary . '</p>',
					]
				)
			);
		}
	}

	/**
	 * Create a bulk action.
	 *
	 * @param string $action_type The action type.
	 * @param array  $record_ids  The record ids.
	 *
	 * @return void
	 */
	public function createBulkAction( $action_type, $record_ids ) {
		$bulk_action = BulkAction::create(
			[
				'action_type' => $action_type,
				'record_ids'  => $record_ids,
			]
		);
		if ( is_wp_error( $bulk_action ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $bulk_action->get_error_messages() ) ) );
		}

		$bulk_actions[] = $bulk_action->id;

		setcookie(
			'sc_bulk_actions',
			wp_json_encode( $bulk_actions ),
			time() + DAY_IN_SECONDS,
			COOKIEPATH,
			COOKIE_DOMAIN,
			is_ssl(),
			true
		);
	}

	/**
	 * Get the pending record ids for a specific action type.
	 *
	 * @param string $action_type The action type.
	 *
	 * @return array
	 */
	public function getPendingRecordIds( $action_type ) {
		if ( empty( $action_type ) || empty( $this->bulk_actions_data[ $action_type ] ) ) {
			return [];
		}

		$pending_record_ids = $this->bulk_actions_data[ $action_type ]['pending_record_ids'] ?? [];

		if ( ! empty( $this->bulk_actions_data[ $action_type ]['processing_record_ids'] ) ) {
			$pending_record_ids = array_merge( $pending_record_ids, $this->bulk_actions_data[ $action_type ]['processing_record_ids'] );
		}

		return $pending_record_ids;
	}
}

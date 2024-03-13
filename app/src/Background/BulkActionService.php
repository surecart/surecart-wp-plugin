<?php

namespace SureCart\Background;

use SureCart\Models\BulkAction;

/**
 * Handled the business logic for Bulk Actions.
 */
class BulkActionService {
	/**
	 * The cookie prefix.
	 *
	 * @var string
	 */
	public $cookie_prefix = 'sc_bulk_action_';

	/**
	 * The bulk actions data.
	 *
	 * @var array
	 */
	public $bulk_actions_data = [];

	/**
	 * The bulk actions.
	 *
	 * @var array
	 */
	public $bulk_actions = [];

	/**
	 * The bulk action statuses.
	 *
	 * @var array
	 */
	public $statuses = array( 'succeeded', 'processing', 'pending', 'invalid', 'completed' );

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		$this->setBulkActions();
		if ( ! empty( $this->bulk_actions ) ) {
			$this->setBulkActionsData();
			$this->deleteSucceededBulkActions();
		}
	}

	/**
	 * Set the bulk actions.
	 *
	 * @return void
	 */
	public function setBulkActions() {
		foreach ( $_COOKIE as $key => $value ) {
			if ( 0 === strpos( $key, $this->cookie_prefix ) ) {
				$this->bulk_actions[] = sanitize_text_field( $value );
			}
		}
	}

	/**
	 * Set the bulk actions data.
	 *
	 * @return void
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
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_bulk_actions' ], $bulk_action->id ); // Saves the bulks actions ids for each status.
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_record_ids' ], ...$bulk_action->record_ids ); // Saves the record ids for each status.
				}
			}
		}
		$this->bulk_actions_data = $bulk_actions;
	}

	/**
	 * Delete succeeded bulk actions from the cookie.
	 *
	 * @return void
	 */
	public function deleteSucceededBulkActions() {
		$succeeded_bulk_actions = $this->getSucceededBulkActions();

		if ( empty( $succeeded_bulk_actions ) ) {
			return;
		}

		foreach ( $succeeded_bulk_actions as $bulk_action_id ) {
			setcookie(
				$this->cookie_prefix . $bulk_action_id,
				'',
				time() - DAY_IN_SECONDS,
				COOKIEPATH,
				COOKIE_DOMAIN,
				is_ssl(),
				true
			);
		}
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
			return $bulk_action;
		}

		setcookie(
			$this->cookie_prefix . $bulk_action->id,
			$bulk_action->id,
			time() + DAY_IN_SECONDS,
			COOKIEPATH,
			COOKIE_DOMAIN,
			is_ssl(),
			true
		);

		return $bulk_action;
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

		$action_data        = $this->bulk_actions_data[ $action_type ] ?? [];
		$pending_record_ids = $action_data['pending_record_ids'] ?? [];

		if ( ! empty( $action_data['processing_record_ids'] ) ) {
			$pending_record_ids = array_merge( $pending_record_ids, $action_data['processing_record_ids'] );
		}

		return $pending_record_ids;
	}

	/**
	 * Get the succeeded bulk actions.
	 *
	 * @return array
	 */
	public function getSucceededBulkActions() {
		if ( empty( $this->bulk_actions_data ) ) {
			return [];
		}

		$succeeded_bulk_actions = [];

		foreach ( $this->bulk_actions_data as $bulk_action_data ) {
			if ( ! empty( $bulk_action_data['succeeded_bulk_actions'] ) ) {
				$succeeded_bulk_actions = array_merge( $succeeded_bulk_actions, $bulk_action_data['succeeded_bulk_actions'] );
			}
		}

		return $succeeded_bulk_actions;
	}
}

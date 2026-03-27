<?php

namespace SureCart\Sync\Tasks;

/**
 * Abstract task class.
 */
abstract class Task {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name;

	/**
	 * Show a notice.
	 *
	 * @var boolean
	 */
	protected $show_notice = false;

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( $this->action_name, [ $this, 'handle' ], 10, 2 );
	}

	/**
	 * Whether to show a notice.
	 *
	 * @param boolean $show_notice Whether to show a notice.
	 *
	 * @return self
	 */
	public function withNotice( $show_notice = true ) {
		$this->show_notice = $show_notice;
		return $this;
	}

	/**
	 * Queue the sync for a later time.
	 *
	 * @param string $collection_term_id The term id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $id ) {
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id'          => $id,
				'show_notice' => $this->show_notice,
			],
			$this->action_name . '-' . $id, // unique id for the term.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Check if the task is scheduled.
	 *
	 * @param string $id The id.
	 *
	 * @return bool
	 */
	public function isScheduled( $id ) {
		return \SureCart::queue()->isScheduled(
			$this->action_name,
			[
				'id'          => $id,
				'show_notice' => $this->show_notice,
			],
			$this->action_name . '-' . $id, // unique id for the term.
		);
	}

	/**
	 * Check are any actions scheduled.
	 *
	 * @return bool
	 */
	public function showNotice() {
		return \SureCart::queue()->showNotice( $this->action_name );
	}

	/**
	 * Cancel the task.
	 *
	 * @param string $id The id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function cancel( $id ) {
		return \SureCart::queue()->cancel(
			$this->action_name,
			[
				'id'          => $id,
				'show_notice' => $this->show_notice,
			],
			$this->action_name . '-' . $id, // unique id for the term.
			true // force unique. This will replace any existing jobs.
		);
	}
}

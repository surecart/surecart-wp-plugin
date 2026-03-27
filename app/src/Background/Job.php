<?php

namespace SureCart\Background;

/**
 * Abstract Job class.
 *
 * @abstract
 * @extends BackgroundProcess
 */
abstract class Job extends BackgroundProcess {
	/**
	 * The next background process in the chain.
	 *
	 * @var BackgroundProcess
	 */
	protected $next = null;

	/**
	 * The task.
	 *
	 * @var \SureCart\Sync\Tasks\Task
	 */
	protected $task;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Sync\Tasks\Task $task The task.
	 */
	public function __construct( $task ) {
		parent::__construct();
		$this->task = $task;
	}

	/**
	 * Bootstrap the background process.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// we need to fake the dispatch method here because ajax handlers are only available in the constructor.
	}

	/**
	 * Job complete.
	 *
	 * @return void
	 */
	protected function complete() {
		parent::complete();

		// run the next job in the chain.
		if ( is_a( $this->next, self::class ) ) {
			$this->next->dispatch();
		}
	}

	/**
	 * Set the next background process in the chain.
	 *
	 * @param BackgroundProcess $next The next background process.
	 *
	 * @return $this
	 */
	public function setNext( $next ) {
		$this->next = $next;
		return $this;
	}

	/**
	 * Get the task.
	 *
	 * @return \SureCart\Sync\Tasks\Task
	 */
	public function getTask() {
		return $this->task;
	}

	/**
	 * Is running.
	 *
	 * @return boolean
	 */
	public function isRunning() {
		return $this->is_active() || $this->task->showNotice();
	}
}

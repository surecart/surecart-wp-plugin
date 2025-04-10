<?php

namespace SureCart\Tests\Sync\Tasks;

use SureCart\Background\QueueService;
use SureCart\Tests\SureCartUnitTestCase;

class MockTask extends \SureCart\Sync\Tasks\Task {
    protected $action_name = 'mock_task_action';

    public function handle( $id, $args ) {
        return true;
    }
}

class TaskTest extends SureCartUnitTestCase {
    protected $task;
    protected $queue;

    public function setUp(): void {
        parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		$queue_service = \Mockery::mock(QueueService::class)->makePartial();
		\SureCart::alias('queue', function () use ($queue_service) {
			return $queue_service;
		});
		$this->queue = $queue_service;

        $this->task = new MockTask();
    }

    public function test_bootstrap_adds_action() {
        // Test that bootstrap adds the action
        $this->task->bootstrap();
        $this->assertEquals(
            10,
            has_action('mock_task_action', [$this->task, 'handle'])
        );
    }

    public function test_with_notice_sets_show_notice() {
        // Test withNotice method
        $result = $this->task->withNotice(true);

        // Should return self for chaining
        $this->assertSame($this->task, $result);

        // Test that show_notice was set
        $reflection = new \ReflectionClass($this->task);
        $property = $reflection->getProperty('show_notice');
        $property->setAccessible(true);
        $this->assertTrue($property->getValue($this->task));
    }

    public function test_queue_creates_async_job() {
        // Mock queue async method
        $this->queue->shouldReceive('async')
            ->once()
            ->with(
                'mock_task_action',
                [
                    'id' => '123',
                    'show_notice' => false
                ],
                'mock_task_action-123',
                true
            )
            ->andReturn(true);

        $result = $this->task->queue('123');
        $this->assertTrue($result);
    }

    public function test_is_scheduled_checks_queue() {
        // Mock queue isScheduled method
        $this->queue->shouldReceive('isScheduled')
            ->once()
            ->with(
                'mock_task_action',
                [
                    'id' => '123',
                    'show_notice' => false
                ],
                'mock_task_action-123'
            )
            ->andReturn(true);

        $result = $this->task->isScheduled('123');
        $this->assertTrue($result);
    }

    public function test_are_actions_scheduled_checks_queue() {
        // Mock queue isScheduled method
        $this->queue->shouldReceive('showNotice')
            ->once()
            ->with('mock_task_action')
            ->andReturn(true);

        $result = $this->task->showNotice();
        $this->assertTrue($result);
    }

    public function test_cancel_cancels_queue_job() {
        // Mock queue cancel method
        $this->queue->shouldReceive('cancel')
            ->once()
            ->with(
                'mock_task_action',
                [
                    'id' => '123',
                    'show_notice' => false
                ],
                'mock_task_action-123',
                true
            )
            ->andReturn(true);

        $result = $this->task->cancel('123');
        $this->assertTrue($result);
    }

    public function test_queue_with_notice_creates_async_job() {
        // Set show notice to true
        $this->task->withNotice(true);

        // Mock queue async method with show_notice true
        $this->queue->shouldReceive('async')
            ->once()
            ->with(
                'mock_task_action',
                [
                    'id' => '123',
                    'show_notice' => true
                ],
                'mock_task_action-123',
                true
            )
            ->andReturn(true);

        $result = $this->task->queue('123');
        $this->assertTrue($result);
    }
}

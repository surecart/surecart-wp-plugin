<?php

namespace SureCart\Tests\Background;

use SureCart\Background\Job;
use SureCart\Sync\Tasks\Task;

class MockJob extends Job {
    protected $prefix = 'test';
    protected $action = 'mock_job';

    protected function task( $args ) {
        return false;
    }

    // Make complete public for testing
    public function completeForTest() {
        return $this->complete();
    }
}

class JobTest extends \WP_UnitTestCase {
    protected $job;
    protected $task;

    public function setUp(): void {
        parent::setUp();
        $this->task = \Mockery::mock(Task::class);
        $this->job = new MockJob($this->task);
    }

    public function test_job_can_set_next_job() {
        $next_job = new MockJob($this->task);
        $result = $this->job->setNext($next_job);
        $this->assertSame($this->job, $result);
    }

    public function test_job_can_get_task() {
        $this->assertSame($this->task, $this->job->getTask());
    }

    public function test_job_is_running_status() {
        // Mock task to return false for scheduled actions
        $this->task->shouldReceive('showNotice')->once()->andReturn(false);

        // Test when job is not active and no actions scheduled
        $this->assertFalse($this->job->isRunning());

        // Mock task to return true for scheduled actions
        $this->task->shouldReceive('showNotice')->once()->andReturn(true);

        // Test when job has scheduled actions
        $this->assertTrue($this->job->isRunning());
    }

    public function test_job_completes_and_chains() {
        // Create a mock next job
        $next_job = \Mockery::mock(MockJob::class);

        // The next job should receive exactly one dispatch call
        $next_job->shouldReceive('dispatch')
            ->once()
            ->andReturn(true);

        // Set the next job in the chain
        $this->job->setNext($next_job);

        // Verify the next job is set correctly
        $reflection = new \ReflectionClass($this->job);
        $property = $reflection->getProperty('next');
        $property->setAccessible(true);
        $this->assertSame($next_job, $property->getValue($this->job));

        // Call complete method
        $method = $reflection->getMethod('complete');
        $method->setAccessible(true);
        $method->invoke($this->job);

        // Verify Mockery expectations (that dispatch was called)
        \Mockery::close();
    }

    public function test_job_completes_without_next_job() {
        // Don't set a next job
        $reflection = new \ReflectionClass($this->job);
        $method = $reflection->getMethod('complete');
        $method->setAccessible(true);

        // This should not throw any errors
        $method->invoke($this->job);

        // Verify the next property is still null
        $property = $reflection->getProperty('next');
        $property->setAccessible(true);
        $this->assertNull($property->getValue($this->job));
    }
}

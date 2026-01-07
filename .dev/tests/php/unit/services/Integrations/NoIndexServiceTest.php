<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Integrations\Abstracts\NoIndexService;

class NoIndexServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var \Mockery\MockInterface
	 */
	protected $service;

	/**
	 * Set up test instance.
	 */
	public function setUp(): void {
		parent::setUp();

		// Create a mock of the abstract class for testing.
		$this->service = \Mockery::mock(NoIndexService::class)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Test that bootstrap throws exception when hook_name is not set.
	 *
	 * @group noindex
	 */
	public function test_bootstrap_throws_exception_without_hook_name() {
		$this->expectException(\RuntimeException::class);
		$this->expectExceptionMessage('Missing hook_name for noindex service:');
		$this->service->bootstrap();
	}

	/**
	 * Test that bootstrap successfully registers filter when hook_name is set.
	 *
	 * @group noindex
	 */
	public function test_bootstrap_with_hook_name() {
		// Set the hook_name property using reflection.
		$reflection = new \ReflectionClass($this->service);
		$property = $reflection->getProperty('hook_name');
		$property->setValue($this->service, 'test_hook');

		// Should not throw an exception.
		$this->service->bootstrap();

		// Verify the filter was added.
		$this->assertTrue(has_filter('test_hook', [$this->service, 'addNoindexForQueryVars']) !== false);
	}

	/**
	 * Test addNoindexForQueryVars returns noindex robots when query vars are present.
	 *
	 * @group noindex
	 */
	public function test_add_noindex_for_query_vars_returns_noindex_robots_when_query_vars_present() {
		// Mock hasNoIndexQueryVars to return true.
		$this->service->shouldReceive('hasNoIndexQueryVars')
			->once()
			->andReturn(true);

		$robots = ['index' => 'index', 'follow' => 'follow'];
		$result = $this->service->addNoindexForQueryVars($robots);

		$this->assertEquals(['noindex' => 'noindex', 'nofollow' => 'nofollow'], $result);
	}

	/**
	 * Test addNoindexForQueryVars returns original robots when query vars are not present.
	 *
	 * @group noindex
	 */
	public function test_add_noindex_for_query_vars_returns_original_robots_when_no_query_vars() {
		// Mock hasNoIndexQueryVars to return false.
		$this->service->shouldReceive('hasNoIndexQueryVars')
			->once()
			->andReturn(false);

		$robots = ['index' => 'index', 'follow' => 'follow'];
		$result = $this->service->addNoindexForQueryVars($robots);

		$this->assertEquals($robots, $result);
	}

	/**
	 * Test hasNoIndexQueryVars returns true when query var is in $_GET.
	 *
	 * @group noindex
	 */
	public function test_has_noindex_query_vars_returns_true_when_query_var_in_get() {
		// Mock getNoIndexQueryVars to return test query vars.
		$this->service->shouldReceive('getNoIndexQueryVars')
			->once()
			->andReturn(['products-search', 'products-order']);

		// Set a query var in $_GET.
		$_GET['products-search'] = 'test';

		// Use reflection to call the protected method.
		$reflection = new \ReflectionClass($this->service);
		$method = $reflection->getMethod('hasNoIndexQueryVars');
		$result = $method->invoke($this->service);

		$this->assertTrue($result);

		// Clean up.
		unset($_GET['products-search']);
	}

	/**
	 * Test hasNoIndexQueryVars returns true when query var is set via get_query_var.
	 *
	 * @group noindex
	 */
	public function test_has_noindex_query_vars_returns_true_when_query_var_registered() {
		// Mock getNoIndexQueryVars to return test query vars.
		$this->service->shouldReceive('getNoIndexQueryVars')
			->once()
			->andReturn(['products-order']);

		// Register and set a query var.
		global $wp_query;
		$wp_query->set('products-order', 'asc');

		// Use reflection to call the protected method.
		$reflection = new \ReflectionClass($this->service);
		$method = $reflection->getMethod('hasNoIndexQueryVars');
		$result = $method->invoke($this->service);

		$this->assertTrue($result);

		// Clean up.
		$wp_query->set('products-order', '');
	}

	/**
	 * Test hasNoIndexQueryVars returns false when no query vars are present.
	 *
	 * @group noindex
	 */
	public function test_has_noindex_query_vars_returns_false_when_no_query_vars() {
		// Mock getNoIndexQueryVars to return test query vars.
		$this->service->shouldReceive('getNoIndexQueryVars')
			->once()
			->andReturn(['products-search', 'products-order']);

		// Use reflection to call the protected method.
		$reflection = new \ReflectionClass($this->service);
		$method = $reflection->getMethod('hasNoIndexQueryVars');
		$result = $method->invoke($this->service);

		$this->assertFalse($result);
	}

	/**
	 * Test getNoIndexQueryVars returns query vars and registered taxonomies.
	 *
	 * @group noindex
	 */
	public function test_get_noindex_query_vars_returns_query_vars_with_taxonomies() {
		// Register a test taxonomy for sc_product.
		register_taxonomy('test_taxonomy', 'sc_product', [
			'public' => true,
			'label'  => 'Test Taxonomy',
		]);

		// Use reflection to call the protected method.
		$reflection = new \ReflectionClass($this->service);
		$method = $reflection->getMethod('getNoIndexQueryVars');
		$result = $method->invoke($this->service);

		// Verify the result contains the default query vars.
		$this->assertContains('products-search', $result);
		$this->assertContains('products-order', $result);
		$this->assertContains('products-orderby', $result);
		$this->assertContains('line_items', $result);
		$this->assertContains('currency', $result);

		// Verify the result contains the registered taxonomy.
		$this->assertContains('products-test_taxonomy', $result);

		// Clean up.
		unregister_taxonomy('test_taxonomy');
	}

	/**
	 * Test getNoIndexQueryVars applies filter.
	 *
	 * @group noindex
	 */
	public function test_get_noindex_query_vars_applies_filter() {
		// Add a filter to modify the query vars.
		add_filter('surecart/noindex_query_vars', function ($query_vars) {
			$query_vars[] = 'custom-query-var';
			return $query_vars;
		});

		// Use reflection to call the protected method.
		$reflection = new \ReflectionClass($this->service);
		$method = $reflection->getMethod('getNoIndexQueryVars');
		$result = $method->invoke($this->service);

		// Verify the custom query var was added.
		$this->assertContains('custom-query-var', $result);

		// Clean up.
		remove_all_filters('surecart/noindex_query_vars');
	}
}

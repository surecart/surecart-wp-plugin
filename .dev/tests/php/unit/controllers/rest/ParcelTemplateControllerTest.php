<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\ParcelTemplateController;
use SureCart\Models\ParcelTemplate;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class ParcelTemplateControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);

		parent::setUp();
	}

	/**
	 * Test the controller class property is set correctly.
	 *
	 * @group parcel-templates
	 */
	public function test_controller_has_correct_model_class() {
		$controller = new ParcelTemplateController();
		$reflection = new \ReflectionClass( $controller );
		$property   = $reflection->getProperty( 'class' );
		$property->setAccessible( true );

		$this->assertSame( ParcelTemplate::class, $property->getValue( $controller ) );
	}

	/**
	 * Test the model has correct endpoint.
	 *
	 * @group parcel-templates
	 */
	public function test_model_has_correct_endpoint() {
		$model      = new ParcelTemplate();
		$reflection = new \ReflectionClass( $model );
		$property   = $reflection->getProperty( 'endpoint' );
		$property->setAccessible( true );

		$this->assertSame( 'parcel_templates', $property->getValue( $model ) );
	}

	/**
	 * Test the model has correct object name.
	 *
	 * @group parcel-templates
	 */
	public function test_model_has_correct_object_name() {
		$model      = new ParcelTemplate();
		$reflection = new \ReflectionClass( $model );
		$property   = $reflection->getProperty( 'object_name' );
		$property->setAccessible( true );

		$this->assertSame( 'parcel_template', $property->getValue( $model ) );
	}

	/**
	 * Test create routes through the model.
	 *
	 * @group parcel-templates
	 */
	public function test_create_calls_model_create() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'parcel_templates' )
			->andReturn(
				(object) [
					'id'   => 'parcel_template_123',
					'name' => 'Small Box',
					'type' => 'box',
				]
			);

		$controller = new ParcelTemplateController();
		$request    = new WP_REST_Request( 'POST', '/surecart/v1/parcel_templates' );
		$request->set_body( wp_json_encode( [ 'name' => 'Small Box', 'package_type' => 'box' ] ) );
		$request->set_header( 'Content-Type', 'application/json' );

		$result = $controller->create( $request );

		$this->assertNotWPError( $result );
		$this->assertSame( 'parcel_template_123', $result->id );
	}

	/**
	 * Test edit routes through the model.
	 *
	 * @group parcel-templates
	 */
	public function test_edit_calls_model_update() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'parcel_templates/parcel_template_123' )
			->andReturn(
				(object) [
					'id'   => 'parcel_template_123',
					'name' => 'Updated Box',
					'type' => 'box',
				]
			);

		$controller = new ParcelTemplateController();
		$request    = new WP_REST_Request( 'PATCH', '/surecart/v1/parcel_templates/parcel_template_123' );
		$request->set_url_params( [ 'id' => 'parcel_template_123' ] );
		$request->set_body( wp_json_encode( [ 'name' => 'Updated Box' ] ) );
		$request->set_header( 'Content-Type', 'application/json' );

		$result = $controller->edit( $request );

		$this->assertNotWPError( $result );
		$this->assertSame( 'Updated Box', $result->name );
	}

	/**
	 * Test delete routes through the model.
	 *
	 * @group parcel-templates
	 */
	public function test_delete_calls_model_delete() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'parcel_templates/parcel_template_123' )
			->andReturn(
				(object) [
					'id'      => 'parcel_template_123',
					'deleted' => true,
				]
			);

		$controller = new ParcelTemplateController();
		$request    = new WP_REST_Request( 'DELETE', '/surecart/v1/parcel_templates/parcel_template_123' );
		$request->set_url_params( [ 'id' => 'parcel_template_123' ] );

		$result = $controller->delete( $request );

		$this->assertNotWPError( $result );
	}

	/**
	 * Test index returns paginated results.
	 *
	 * @group parcel-templates
	 */
	public function test_index_returns_paginated_results() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'parcel_templates' )
			->andReturn(
				(object) [
					'data'       => [
						(object) [ 'id' => 'pt_1', 'name' => 'Small Box' ],
						(object) [ 'id' => 'pt_2', 'name' => 'Large Box' ],
					],
					'pagination' => (object) [
						'count' => 2,
						'limit' => 20,
					],
				]
			);

		$controller = new ParcelTemplateController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/parcel_templates' );
		$request->set_param( 'per_page', 20 );
		$request->set_param( 'page', 1 );

		$result = $controller->index( $request );

		$this->assertNotWPError( $result );
		$this->assertCount( 2, $result->data );
	}
}

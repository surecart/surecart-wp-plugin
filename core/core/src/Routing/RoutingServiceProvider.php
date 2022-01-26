<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Routing;

use Pimple\Container;
use CheckoutEngineCore\Routing\Conditions\ConditionFactory;
use CheckoutEngineCore\ServiceProviders\ExtendsConfigTrait;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide routing dependencies
 *
 * @codeCoverageIgnore
 */
class RoutingServiceProvider implements ServiceProviderInterface {
	use ExtendsConfigTrait;

	/**
	 * Key=>Class dictionary of condition types
	 *
	 * @var array<string, string>
	 */
	protected static $condition_types = [
		'url'           => Conditions\UrlCondition::class,
		'custom'        => Conditions\CustomCondition::class,
		'multiple'      => Conditions\MultipleCondition::class,
		'negate'        => Conditions\NegateCondition::class,
		'post_id'       => Conditions\PostIdCondition::class,
		'post_slug'     => Conditions\PostSlugCondition::class,
		'post_status'   => Conditions\PostStatusCondition::class,
		'post_template' => Conditions\PostTemplateCondition::class,
		'post_type'     => Conditions\PostTypeCondition::class,
		'query_var'     => Conditions\QueryVarCondition::class,
		'ajax'          => Conditions\AjaxCondition::class,
		'admin'         => Conditions\AdminCondition::class,
	];

	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$this->extendConfig(
			$container,
			'routes',
			[
				'web'   => [
					'definitions' => '',
					'attributes'  => [
						'middleware' => [ 'web' ],
						'namespace'  => 'App\\Controllers\\Web\\',
						'handler'    => 'CheckoutEngineCore\\Controllers\\WordPressController@handle',
					],
				],
				'admin' => [
					'definitions' => '',
					'attributes'  => [
						'middleware' => [ 'admin' ],
						'namespace'  => 'App\\Controllers\\Admin\\',
					],
				],
				'ajax'  => [
					'definitions' => '',
					'attributes'  => [
						'middleware' => [ 'ajax' ],
						'namespace'  => 'App\\Controllers\\Ajax\\',
					],
				],
			]
		);

		/** @var Container $container */
		$container[ CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY ] = static::$condition_types;

		$container[ CHECKOUT_ENGINE_ROUTING_ROUTER_KEY ] = function ( $c ) {
			return new Router(
				$c[ CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY ],
				$c[ CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY ]
			);
		};

		$container[ CHECKOUT_ENGINE_ROUTING_CONDITIONS_CONDITION_FACTORY_KEY ] = function ( $c ) {
			return new ConditionFactory( $c[ CHECKOUT_ENGINE_ROUTING_CONDITION_TYPES_KEY ] );
		};

		$container[ CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY ] = $container->factory(
			function ( $c ) {
				return new RouteBlueprint( $c[ CHECKOUT_ENGINE_ROUTING_ROUTER_KEY ], $c[ CHECKOUT_ENGINE_VIEW_SERVICE_KEY ] );
			}
		);

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'route', CHECKOUT_ENGINE_ROUTING_ROUTE_BLUEPRINT_KEY );
		$app->alias( 'routeUrl', CHECKOUT_ENGINE_ROUTING_ROUTER_KEY, 'getRouteUrl' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

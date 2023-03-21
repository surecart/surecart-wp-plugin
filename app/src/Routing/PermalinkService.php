<?php

namespace SureCart\Routing;

/**
 * A service for registering custom routes.
 */
class PermalinkService {
	/**
	 * The regex url.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * The regex url.
	 *
	 * @var string
	 */
	protected $query = '';

	/**
	 * Holds the params we care about for this route.
	 *
	 * @var array
	 */
	protected $params = [];

	/**
	 * Query vars.
	 *
	 * @var array
	 */
	protected $query_vars = [];

	/**
	 * The priority of the new rule.
	 *
	 * @var string
	 */
	protected $priority = 'top';

	/**
	 * Set the url.
	 *
	 * @param string $url The url.
	 *
	 * @return $this
	 */
	public function url( $url ) {
		$this->url = $url;
		return $this;
	}

	/**
	 * Set query.
	 *
	 * @param string $query The query.
	 *
	 * @return $this
	 */
	public function query( $query ) {
		$this->query = $query;
		return $this;
	}

	/**
	 * Add any params we will use.
	 *
	 * @param array $params Array of params.
	 *
	 * @return $this
	 */
	public function params( $params = [] ) {
		$this->params = $params;
		return $this;
	}

	/**
	 * Set the priority of the rule.
	 *
	 * @param "top"|"bottom" $priority The priority.
	 *
	 * @return $this
	 */
	public function priority( $priority ) {
		$this->priority = $priority;
		return $this;
	}

	/**
	 * Add the rewrite rule.
	 *
	 * @return void
	 */
	public function addRewriteRule() {
		add_rewrite_rule( $this->url, $this->query, $this->priority );
	}

	/**
	 * Add query vars.
	 *
	 * @param array $query_vars The query vars.
	 *
	 * @return array
	 */
	public function addQueryVars( $query_vars ) {
		return array_merge( $query_vars, $this->params );
	}

	/**
	 * Create the permalink.
	 * This handles adding the rewrite rule and query vars.
	 *
	 * @return mixed
	 */
	public function route() {
		// add the query vars.
		add_filter( 'query_vars', [ $this, 'addQueryVars' ] );
		// add the rewrite rule.
		add_action( 'init', [ $this, 'addRewriteRule' ] );
		// return the route with params.
		return $this->routeWithParams();
	}

	/**
	 * Get the route with params.
	 *
	 * @return SureCartCore\Routing\RouteInterface
	 */
	public function routeWithParams() {
		// get the route.
		$route = \SureCart::route()->get();
		// add the params to the route.
		foreach ( $this->params as $param ) {
			$route = $route->where( 'query_var', $param );
		}
		// return the route.
		return $route;
	}
}

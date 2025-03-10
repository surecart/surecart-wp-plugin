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
	 * Additional rewrite rules to add.
	 *
	 * @var array
	 */
	protected $additional_rules = [];

	/**
	 * Rules to remove based on pattern matching.
	 *
	 * @var array
	 */
	protected $remove_rules_patterns = [];

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
	 * Add an additional rewrite rule.
	 *
	 * @param string $regex The regex for the rule.
	 * @param string $query The query for the rule.
	 * @param string $priority The priority for the rule.
	 *
	 * @return $this
	 */
	public function addRule( $regex, $query, $priority = 'top' ) {
		$this->additional_rules[] = [
			'regex'    => $regex,
			'query'    => $query,
			'priority' => $priority,
		];
		return $this;
	}

	/**
	 * Remove rules that match specific patterns.
	 *
	 * @param string $rule_pattern Pattern to match against the rule.
	 * @param string $query_pattern Pattern to match against the query.
	 *
	 * @return $this
	 */
	public function removeRules( $rule_pattern, $query_pattern ) {
		$this->remove_rules_patterns[] = [
			'rule'  => $rule_pattern,
			'query' => $query_pattern,
		];
		return $this;
	}

	/**
	 * Add the rewrite rule.
	 *
	 * @return void
	 */
	public function addRewriteRule() {
		$rules = get_option( 'rewrite_rules' );

		// Remove any rules based on patterns.
		foreach ( $this->remove_rules_patterns as $patterns ) {
			foreach ( $rules as $rule => $rewrite ) {
				if ( preg_match( $patterns['rule'], $rule ) && preg_match( $patterns['query'], $rewrite ) ) {
					unset( $rules[ $rule ] );
				}
			}
		}

		// Add any additional rules.
		foreach ( $this->additional_rules as $rule ) {
			add_rewrite_rule( $rule['regex'], $rule['query'], $rule['priority'] );
		}

		// Add the main rewrite rule.
		add_rewrite_rule( $this->url, $this->query, $this->priority );

		if ( ! isset( $rules[ $this->url ] ) ) {
			flush_rewrite_rules();
		}
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
	public function create() {
		// add the query vars.
		add_filter( 'query_vars', [ $this, 'addQueryVars' ] );
		// add the rewrite rule.
		add_action( 'init', [ $this, 'addRewriteRule' ] );
	}
}

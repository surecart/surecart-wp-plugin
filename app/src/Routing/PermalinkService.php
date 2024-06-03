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
     * The option name for the stored version.
     *
     * @var string
     */
    protected $option_name = 'surecart_flush_rewrite_rules';

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
		$rules = get_option( 'rewrite_rules' );
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
     * Retrieves the stored version from the WordPress options.
     *
     * @return string The stored version.
     */
    public function getStoredVersion() {
        return get_option( $this->option_name, '0.0.0' );
    }

    /**
     * Retrieves the current plugin version.
     *
     * @return string The current plugin version.
     */
    public function getCurrentPluginVersion() {
        return \SureCart::plugin()->version();
    }

	/**
     * Checks if the current plugin version is different from the stored version.
     *
     * @param string $current_version The current plugin version.
     * @param string $stored_version The stored plugin version.
     * 
     * @return bool True if the versions are different, false otherwise.
     */
    public function isVersionDifferent( $current_version, $stored_version ) {
        return version_compare( $current_version, $stored_version, '!=' );
    }

	/**
	 * Flush the rewrite rules on version change.
	 *
	 * @return void
	 */
	public function flushRewriteRulesOnVersionChange() {
		$current_version = $this->getCurrentPluginVersion();
        $stored_version = $this->getStoredVersion();

        if ( ! $this->isVersionDifferent( $current_version, $stored_version ) ) {
            return false;
        }

        return $this->flushRewriteRulesAndUpdateVersion( $current_version );
	}

	/**
     * Flushes the rewrite rules and updates the stored version.
     *
     * @param string $new_version The new plugin version.
     * 
     * @return void
     */
    public function flushRewriteRulesAndUpdateVersion( $new_version ) {
        flush_rewrite_rules();
        return update_option( $this->option_name, $new_version, false );
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

		add_action( 'admin_init', [ $this, 'flushRewriteRulesOnVersionChange' ] );
	}
}

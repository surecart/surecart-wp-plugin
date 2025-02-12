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
		$rules = get_option( 'rewrite_rules' );

		global $wp_rewrite;
		$permalinks = get_option( 'surecart_permalinks' );
		// Fix the rewrite rules when the product permalink has %sc_collection% flag.
		if ( preg_match( '`/(.+)(/%sc_collection%)`', $permalinks['product_page'], $matches ) ) {
			foreach ( $rules as $rule => $rewrite ) {
				if ( preg_match( '`^' . preg_quote( $matches[1], '`' ) . '/\(`', $rule ) && preg_match( '/^(index\.php\?sc_collection)(?!(.*product))/', $rewrite ) ) {
					unset( $rules[ $rule ] );
				}
			}
		}

		add_rewrite_rule( $this->url, $this->query, $this->priority );

		// Add rewrite rule for default product route.
		add_rewrite_rule( '^shop/([a-z0-9-]+)/?$', 'index.php?sc_product=$matches[1]', 'top' );

		flush_rewrite_rules();
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

		add_filter( 'post_type_link', [ $this, 'surecartProductPostTypeLink' ], 10, 2 );

		add_action( 'template_redirect', [ $this, 'surecartProductCanonicalRedirect' ], 5 );
	}

	/**
	 * Filter the post type link for products.
	 *
	 * @param string   $permalink The post's permalink.
	 * @param \WP_Post $post The post in question.
	 *
	 * @return string
	 */
	public function surecartProductPostTypeLink( string $permalink, \WP_Post $post ): string {
		// Abort if post is not a product.
		if ( 'sc_product' !== $post->post_type ) {
			return $permalink;
		}

		// Abort early if the placeholder rewrite tag isn't in the generated URL.
		if ( false === strpos( $permalink, '%' ) ) {
			return $permalink;
		}

		// Get the custom taxonomy terms in use by this post (sc_collection).
		$terms = get_the_terms( $post->ID, 'sc_collection' );

		if ( ! empty( $terms ) ) {
			$collection_object = apply_filters( 'sc_product_post_type_link_sc_collection', $terms[0], $terms, $post );
			$sc_collection     = $collection_object->slug;
		} else {
			// If no terms are assigned to this post, use an empty string.
			$sc_collection = '';

			// Remove extra / from the permalink structure.
			$permalink = str_replace( '/%sc_collection%', '', $permalink );
		}

		// Replace placeholders in the permalink structure.
		$find = array(
			'%sc_collection%',
			'%post_id%',
		);

		$replace = array(
			$sc_collection,
			$post->ID,
		);

		return str_replace( $find, $replace, $permalink );
	}

	/**
	 * Redirect to the canonical URL for a product.
	 *
	 * @return void
	 */
	public function surecartProductCanonicalRedirect(): void {
		global $wp_rewrite;

		if (
			! sc_get_product()
			|| ! is_a( $wp_rewrite, \WP_Rewrite::class )
		) {
			return;
		}

		// Get the specified category slug.
		$specified_category_slug = get_query_var( 'sc_collection' );

		if ( ! is_string( $specified_category_slug ) || strlen( $specified_category_slug ) < 1 ) {
			return;
		}

		// Determine the expected category slug for the product.
		$expected_category_slug = $this->surecartProductPostTypeLink( '%sc_collection%', get_post( get_the_ID() ) );

		if ( $specified_category_slug === $expected_category_slug ) {
			return;
		}

		// Redirect to the canonical URL for the product.
		$query_vars = isset( $_GET ) && is_array( $_GET ) ? $_GET : array();
		wp_safe_redirect( add_query_arg( $query_vars, get_permalink( get_the_ID() ) ), 301 );
		exit();
	}
}

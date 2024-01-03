<?php

declare(strict_types=1);

namespace SureCart\WordPress\Templates;

use \SureCartVendors\Pimple\Container;

/**
 * The Order bump template service.
 */
class UpsellTemplatesService {
	/**
	 * The service container.
	 *
	 * @var Container $container
	 */
	private Container $container;

	/**
	 * The template file/name associations.
	 *
	 * @var array
	 */
	private array $templates = [];

	/**
	 * The post type for the templates.
	 *
	 * @var string
	 */
	private string $post_type = 'sc_bump';

	/**
	 * SureCart plugin slug.
	 *
	 * This is used to save templates to the DB which are stored against this value in the wp_terms table.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'surecart/surecart';

	/**
	 * Get things going.
	 *
	 * @param array $container The service container.
	 * @param array $templates The template file/name associations.
	 */
	public function __construct( $container, $templates ) {
		$this->container = $container;
		$this->templates = $templates;
	}

	/**
	 * Bootstrap actions and filters.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'theme_' . $this->post_type . '_templates', [ $this, 'addTemplates' ] );
		add_filter( 'template_include', [ $this, 'includeTemplate' ], 9 );

		// Bump page query overrides.
		add_filter( 'posts_pre_query', [ $this, 'overrideBumpPostQuery' ], 10, 2 );
		add_filter( 'query_vars', [ $this, 'addCurrentBumpQueryVar' ] );
		// add_filter( 'get_post_metadata', [ $this, 'overrideBumpPostMeta' ], 10, 4 );
	}

	/**
	 * Short-circuits the return value of a meta field for our post type.
	 *
	 * @param mixed  $value     The value to return, either a single metadata value or an array
	 *                          of values depending on the value of `$single`. Default null.
	 * @param int    $object_id ID of the object metadata is for.
	 * @param string $meta_key  Metadata key.
	 * @param bool   $single    Whether to return only the first value of the specified `$meta_key`.
	 *
	 * @return mixed
	 */
	public function overrideBumpPostMeta( $value, $object_id, $meta_key, $single ) {
		// not our meta query.
		if ( 'sc_bump_id' !== $meta_key && 'sc_bump_slug' !== $meta_key ) {
			return $value;
		}

		$bump = get_query_var( 'surecart_current_bump' );

		if ( ! $bump ) {
			// get the bump in case the bump page id query var is the slug.
			$bump_id = get_query_var( 'sc_bump_id' );
			$bump    = \SureCart\Models\Bump::with( [ 'price' ] )->find( $bump_id );
		}

		// we don't have an id or slug.
		if ( empty( $bump->id ) || empty( $bump->slug ) ) {
			return $value;
		}

		die($bump->id);

		// return the id.
		if ( 'sc_bump_id' === $meta_key ) {
			return $bump->id;
		}

		// return the slug.
		if ( 'sc_bump_slug' === $meta_key ) {
			return $bump->id; // TODO: for now, we don't have the slug for bump.
		}

		return $value;
	}

	/**
	 * Add surecart_current_bump to list of query vars.
	 *
	 * @param array $vars The query vars.
	 * @return array
	 */
	public function addCurrentBumpQueryVar( array $vars ): array {
		$vars[] = 'surecart_current_product';
		// $vars[] = 'surecart_current_bump';
		return $vars;
	}

	/**
	 * Filters the posts array before the query takes place to return a product post.
	 * Return a non-null value to bypass WordPress' default post queries.
	 *
	 * Filtering functions that require pagination information are encouraged to set
	 * the `found_posts` and `max_num_pages` properties of the WP_Query object,
	 * passed to the filter by reference. If WP_Query does not perform a database
	 * query, it will not have enough information to generate these values itself.
	 *
	 * @param WP_Post[]|int[]|null $posts Return an array of post data to short-circuit WP's query,
	 *                                    or null to allow WP to run its normal queries.
	 * @param \WP_Query            $wp_query The WP_Query instance (passed by reference).
	 *
	 * @return WP_Post[]|null Array of post data, or null to allow WP to run its normal queries.
	 */
	public function overrideBumpPostQuery( $posts, \WP_Query $wp_query ) {
		$bump_id = isset( $wp_query->query['sc_bump_id'] ) ? $wp_query->query['sc_bump_id'] : null;
		if ( ! $bump_id ) {
			return $posts;
		}

		$bump = \SureCart\Models\Bump::with( [ 'price' ] )->find( $bump_id );
		if ( is_wp_error( $bump ) ) {
			$wp_query->is_404 = true;
			return $posts;
		}

		set_query_var( 'surecart_current_bump', $bump );

		$product = \SureCart\Models\Product::with( [ 'prices', 'image', 'variants', 'variant_options' ] )->find( $bump->price->product ?? '' );
		set_query_var( 'surecart_current_product', $product );

		// create a fake post for the bump.
		$post                    = new \stdClass();
		$post->post_title        = $bump->name;
		$post->post_name         = $bump->id;
		$post->post_content      = '<div>' . ( $bump->template_part->content ?? '' ) . '</div>';
		$post->post_status       = 'publish';
		$post->post_type         = $this->post_type;
		$post->sc_id             = $bump->id;
		$post->bump              = $bump;
		$post->product           = $product;
		$post->post_author       = 1;
		$post->post_parent       = 0;
		$post->comment_count     = 0;
		$post->comment_status    = 'closed';
		$post->ping_status       = 'closed';
		$post->post_password     = '';
		$post->post_excerpt      = '';
		$post->post_date         = ( new \DateTime( "@$bump->created_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' );
		$post->post_date_gmt     = date_i18n( 'Y-m-d H:i:s', $bump->created_at, true );
		$post->post_modified     = ( new \DateTime( "@$bump->updated_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' );
		$post->post_modified_gmt = date_i18n( 'Y-m-d H:i:s', $bump->updated_at, true );
		$post->ID                = 999999999;
		$posts                   = array( $post );

		$wp_query->found_posts       = 1;
		$wp_query->max_num_pages     = 1;
		$wp_query->is_singular       = true;
		$wp_query->is_single         = true;
		$wp_query->is_archive        = false;
		$wp_query->is_tax            = false;
		$wp_query->is_home           = false;
		$wp_query->is_search         = false;
		$wp_query->is_404            = false;
		$wp_query->queried_object    = $post;
		$wp_query->queried_object_id = $post->ID;

		return $posts;
	}

	/**
	 * Add the templates. to the existing templates.
	 *
	 * @param array $posts_templates Existing templates.
	 *
	 * @return array
	 */
	public function addTemplates( array $posts_templates ) : array {
		return array_merge( $posts_templates, $this->templates );
	}

	/**
	 * Include the template if it is set.
	 *
	 * @param string $template Template url.
	 *
	 * @return string
	 */
	public function includeTemplate( string $template ): string {
		global $post;
		$id = $post->ID ?? null;

		// check for bump and use the template id.
		$bump = get_query_var( 'surecart_current_bump' );

		if ( ! empty( $bump->metadata->wp_template_id ) ) {
			$page_template = $bump->metadata->wp_template_id;
		} else {
			$page_template = get_post_meta( $id, '_wp_page_template', true );
		}

		// if the set template does not match one of these templates.
		if ( empty( $page_template ) || false === strpos( $page_template, '.php' ) ) {
			return $template;
		}

		$file = trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . '/templates/' . $page_template;

		// Return file if it exists.
		if ( file_exists( $file ) ) {
			return $file;
		}

		return $template;
	}
}

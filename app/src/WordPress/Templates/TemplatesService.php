<?php


namespace SureCart\WordPress\Templates;

/**
 * The template service.
 */
class TemplatesService {
	/**
	 * The service container.
	 *
	 * @var array
	 */
	private $container;

	/**
	 * The template file/name associations.
	 *
	 * @var array
	 */
	private $templates = [];

	/**
	 * The post type for the templates.
	 *
	 * @var string
	 */
	private $post_type = '';

	/**
	 * Get things going.
	 *
	 * @param array $templates The template file/name associations.
	 */
	public function __construct( $container, $templates, $post_type ) {
		$this->container = $container;
		$this->templates = $templates;
		$this->post_type = $post_type;
	}

	/**
	 * Bootstrap actions and filters.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'theme_' . $this->post_type . '_templates', [ $this, 'addTemplates' ] );
		add_filter( 'template_include', [ $this, 'includeTemplate' ] );
		add_filter( 'body_class', [ $this, 'bodyClass' ] );
		add_action( 'init', [ $this, 'registerMeta' ] );
	}

	/**
	 * The blocks template service.
	 *
	 * @return void
	 */
	public function blocks() {
		return new BlockTemplatesService( $this->container );
	}

	/**
	 * Register any template meta we need.
	 */
	public function registerMeta() {
		register_meta(
			'post',
			'_surecart_dashboard_logo_width',
			[
				'auth_callback' => function( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
					return current_user_can( 'edit_post', $object_id );
				},
				'default'       => '180px',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
			]
		);

		foreach ( [
			'show_logo',
			'navigation_orders',
			'navigation_subscriptions',
			'navigation_downloads',
			'navigation_billing',
			'navigation_account',
		] as $toggle ) {
			register_meta(
				'post',
				'_surecart_dashboard_' . $toggle,
				[
					'auth_callback' => function( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
						return current_user_can( 'edit_post', $object_id );
					},
					'default'       => true,
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'boolean',
				]
			);
		}
	}

	/**
	 * Is one of our templates active?
	 *
	 * @return boolean
	 */
	public function isTemplateActive() {
		$template = get_page_template_slug();
		return false !== $template && array_key_exists( $template, $this->templates );
	}

	/**
	 * Add the templates. to the existing templates.
	 *
	 * @param array $posts_templates
	 *
	 * @return array
	 */
	public function addTemplates( $posts_templates ) {
		return array_merge( $posts_templates, $this->templates );
	}

	/**
	 * Include the template if it is set.
	 *
	 * @param string $template Template url.
	 *
	 * @return string
	 */
	public function includeTemplate( $template ) {
		global $post;

		// If it is nont a single post/page/post-type, don't apply the template from the plugin.
		if ( ! is_singular() ) {
			return $template;
		}

		// if the set template does not match one of these templates.
		if ( ! isset( $this->templates[ get_post_meta( $post->ID, '_wp_page_template', true ) ] ) ) {
			return $template;
		}

		$file = trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . '/templates/' . get_post_meta( $post->ID, '_wp_page_template', true );

		// Return file if it exists.
		if ( file_exists( $file ) ) {
			return $file;
		}

		return $template;
	}

	/**
	 * Add to the body class if it's our template.
	 *
	 * @param array $body_class Array of body class names.
	 *
	 * @return array
	 */
	public function bodyClass( $body_class ) {
		$template = get_page_template_slug();

		if ( false !== $template && $this->isTemplateActive() ) {
			$body_class[] = 'surecart-template';
			$body_class[] = 'surecart-template-' . get_template();
		}

		return $body_class;
	}
}

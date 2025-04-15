<?php
namespace SureCart\Integrations\Elementor;

use SureCart\Integrations\Elementor\Conditions\Conditions;
use SureCart\Integrations\Elementor\Documents\ProductDocument;
use SureCart\Migration\ProductPageWrapperService;
use SureCart\Models\Product;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Elementor service provider.
 */
class ElementorServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.elementor.widgets']      = function () {
			return new ElementorWidgetsService();
		};
		$container['surecart.elementor.dynamic_tags'] = function () {
			return new ElementorDynamicTagsService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		// Elementor integration.
		add_action( 'elementor/widgets/register', [ $this, 'widget' ] );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'load_scripts' ] );
		add_action( 'elementor/elements/categories_registered', [ $this, 'categories_registered' ] );

		// Register product theme condition.
		if ( defined( 'ELEMENTOR_PRO_VERSION' ) ) {
			add_action( 'elementor/documents/register', [ $this, 'register_document' ] );
			add_action( 'elementor/theme/register_conditions', [ $this, 'product_theme_conditions' ] );
			add_filter( 'elementor/query/get_autocomplete/surecart-product', [ $this, 'get_autocomplete' ], 10, 2 );
			add_filter( 'elementor/query/get_value_titles/surecart-product', [ $this, 'get_titles' ], 10, 2 );

			// Add product widget wrapper.
			add_action( 'elementor/frontend/container/before_render', [ $this, 'addProductWrapperStart' ] );
			add_action( 'elementor/frontend/container/after_render', [ $this, 'addProductWrapperEnd' ] );
			add_action( 'elementor/element/container/section_layout_container/after_section_start', [ $this, 'injectProductFormControls' ], 10 );
			add_action( 'elementor/frontend/before_get_builder_content', [ $this, 'preReturnSerializedBlock' ] );
			add_action( 'elementor/frontend/the_content', [ $this, 'doBlocksAtEnd' ], 10 );
			add_filter( 'elementor/frontend/the_content', [ $this, 'showAlertIfNotUsingProductWrapper' ], 11 );
		}

		// Bootstrap the widgets.
		$container['surecart.elementor.widgets']->bootstrap();

		// Bootstrap the dynamic tags.
		$container['surecart.elementor.dynamic_tags']->bootstrap();
	}

	/**
	 * Show alert if not using product wrapper.
	 *
	 * @param string $content The content.
	 *
	 * @return string
	 */
	public function showAlertIfNotUsingProductWrapper( $content ) {
		// Show only to the users who has the permissions to edit the post.
		if ( ! current_user_can( 'edit_posts', get_the_ID() ) ) {
			return $content;
		}

		// If no surecart elements in the content, return.
		$product_page_wrapper = new ProductPageWrapperService( $content );
		if ( $product_page_wrapper->hasProductPageWrapper() || ! $product_page_wrapper->hasAnySureCartProductBlock() ) {
			return $content;
		}

		$alert  = '<div class="sc-alert sc-alert-warning" style="margin:1em 0;padding:1em;border:1px solid #ffc107;background:#fff3cd;color:#856404;">';
		$alert .= sprintf(
			/* translators: %s: URL to the SureCart documentation page. */
			esc_html__( '⚠️ Warning: SureCart widgets must be placed inside a "Product Form" container to function properly. Please wrap them accordingly. &nbsp; %s', 'surecart' ),
			'<a href="https://surecart.com/docs/elementor-product-form" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Learn more', 'surecart' ) . '</a>'
		);
		$alert .= '</div>';

		return $alert . $content;
	}

	/**
	 * Inject product form controls.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 * @return void
	 */
	public function injectProductFormControls( $element ) {
		$element->add_control(
			'surecart_container_type',
			[
				'type'    => \Elementor\Controls_Manager::SELECT,
				'label'   => esc_html__( 'Container Type', 'surecart' ),
				'default' => 'default',
				'options' => [
					'default'       => esc_html__( 'Default', 'surecart' ),
					'surecart_form' => esc_html__( 'Product Form', 'surecart' ),
				],
			]
		);
	}

	/**
	 * Add product wrapper start.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 *
	 * @return void
	 */
	public function addProductWrapperStart( $element ) {
		$settings = $element->get_settings_for_display();
		if ( 'surecart_form' === $settings['surecart_container_type'] ) {
			echo '<!-- wp:surecart/product-page {"align":"wide"} -->';
		}
	}

	/**
	 * Add product wrapper end.
	 *
	 * @param \Elementor\Widget_Base $element The element.
	 *
	 * @return void
	 */
	public function addProductWrapperEnd( $element ) {
		$settings = $element->get_settings_for_display();
		if ( 'surecart_form' === $settings['surecart_container_type'] ) {
			echo '<!-- /wp:surecart/product-page -->';
		}
	}

	/**
	 * Adds the block serialization filter before Elementor content is processed.
	 *
	 * @return void
	 */
	public function preReturnSerializedBlock(): void {
		add_filter( 'pre_render_block', [ $this, 'serializeBlock' ], 10, 2 );
	}

	/**
	 * Process Elementor content and remove the serialization filter.
	 *
	 * @param string $content The content to process
	 *
	 * @return string The processed content
	 */
	public function doBlocksAtEnd( string $content ): string {
		remove_filter( 'pre_render_block', [ $this, 'serializeBlock' ], 10, 2 );
		return do_blocks( $content );
	}

	/**
	 * Disable Elementor render block.
	 *
	 * @param array $rendered The rendered block.
	 * @param array $parsed_block The parsed block.
	 *
	 * @return array
	 */
	public function serializeBlock( $rendered, $parsed_block ) {
		// don't serialize if it includes the surecart/ prefix.
		if ( strpos( $parsed_block['blockName'] ?? '', 'surecart/' ) !== false ) {
			return $rendered;
		}

		return $rendered;
	}

	/**
	 * Get the titles for the query control
	 * This is important as it shows the previously selected items when the conditions load in.
	 *
	 * @param array $results The results.
	 * @param array $request The request.
	 *
	 * @return array
	 */
	public function get_titles( $results, $request ) {
		if ( 'surecart-product' !== $request['get_titles']['object'] || empty( $request['id'] ) ) {
			return $results;
		}

		$products = Product::where(
			[
				'ids' => [ $request['id'] ],
			]
		)->get();

		foreach ( $products as $product ) {
			$results[ $product->id ] = $product->name;
		}
		return $results;
	}

	/**
	 * Get autocomplete
	 *
	 * @param array $results The results.
	 * @param array $data Request data.
	 *
	 * @return array
	 */
	public function get_autocomplete( $results, $data ) {
		if ( 'surecart-product' !== $data['autocomplete']['object'] ) {
			return $results;
		}

		$products = Product::where(
			[
				'query'    => $data['q'],
				'archived' => false,
			]
		)->get();

		foreach ( $products as $product ) {
			$results[] = [
				'id'   => $product->id,
				'text' => $product->name,
			];
		}
		return $results;
	}


	/**
	 * Elementor load scripts
	 *
	 * @return void
	 */
	public function load_scripts() {
		wp_enqueue_script( 'surecart-elementor-editor', plugins_url( 'assets/editor.js', __FILE__ ), array( 'jquery' ), \SureCart::plugin()->version(), true );
		wp_enqueue_style( 'surecart-elementor-style', plugins_url( 'assets/editor.css', __FILE__ ), '', \SureCart::plugin()->version(), 'all' );
		wp_localize_script(
			'surecart-elementor-editor',
			'scElementorData',
			[
				'site_url'                    => site_url(),
				'sc_product_template'         => $this->get_elementor_template_from_file( 'surecart-single-product.json' ),
				'sc_product_card_template'    => $this->get_elementor_template_from_file( 'surecart-product-card.json' ),
				'sc_product_pricing_template' => $this->get_elementor_template_from_file( 'surecart-product-pricing.json' ),
			]
		);
	}

	/**
	 * Elementor surecart categories register.
	 *
	 * @param \Elementor\Elements_Manager $elements_manager The elements manager.
	 *
	 * @return void
	 */
	public function categories_registered( $elements_manager ) {
		$elements_manager->add_category(
			'surecart-elementor-layout',
			[
				'title' => esc_html__( 'SureCart Layout', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);

		$elements_manager->add_category(
			'surecart-elementor-elements',
			[
				'title' => esc_html__( 'SureCart Elements', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);

		$elements_manager->add_category(
			'surecart-elementor-checkout',
			[
				'title' => esc_html__( 'SureCart Checkout Page', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);
	}

	/**
	 * Elementor widget register.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager The widgets manager.
	 *
	 * @return void
	 */
	public function widget( $widgets_manager ) {
		$widgets_manager->register( new ReusableFormWidget() );
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Documents_Manager $documents_manager The documents manager.
	 *
	 * @return void
	 */
	public function register_document( $documents_manager ) {
		$documents_manager->register_document_type( 'surecart-product', ProductDocument::get_class_full_name() );
	}

	/**
	 * Add product theme condition.
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager $conditions_manager The conditions manager.
	 *
	 * @return void
	 */
	public function product_theme_conditions( $conditions_manager ) {
		$conditions_manager->register_condition_instance( new Conditions() );
	}

	/**
	 * Frontend builder content data.
	 *
	 * Filters the builder content in the frontend.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data    The builder content.
	 * @param int   $post_id The post ID.
	 */
	public function append_product_widget_wrapper( $data, $post_id ): array {
		// If no data, return.
		if ( empty( $data[0]['elements'] ) ) {
			return $data;
		}

		// If no surecart blocks in the content, return.
		if ( ! $this->needsProductElement( $post_id ) ) {
			return $data;
		}

		return $this->addProductElement( $data );
	}

	/**
	 * Check if the post needs product element.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function needsProductElement( $post_id ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return false;
		}

		$product_page_wrapper = new ProductPageWrapperService( $post->post_content );

		// If already has product page wrapper, return.
		if ( $product_page_wrapper->hasProductPageWrapper() ) {
			return false;
		}

		// Check if the post has any surecart product block.
		return $product_page_wrapper->hasAnySureCartProductBlock();
	}

	/**
	 * Add product element wrapper to the content.
	 *
	 * @param array $data The data.
	 *
	 * @return array
	 */
	public function addProductElement( array $data ): array {
		add_filter(
			'elementor/frontend/the_content',
			function ( $content ) {
				if ( empty( sc_get_product() ) ) {
					return $content;
				}

				$product_page_wrapper = new ProductPageWrapperService( $content );

				// there is no surecart product block in the content..
				if ( empty( $product_page_wrapper->hasAnySureCartProductBlock() ) ) {
					return $content;
				}

				return $product_page_wrapper->addProductPageWrapper();
			},
			9 // this is important to run this filter at the end of the content.
		);
		return $data;
	}

	/**
	 * Get Elementor template from file.
	 *
	 * @param string $file_name The file name.
	 *
	 * @return array
	 */
	public function get_elementor_template_from_file( string $file_name ) {
		try {
			$template_path    = SURECART_PLUGIN_DIR . '/templates/elementor/' . $file_name;
			$template_content = file_get_contents( $template_path ); // phpcs:ignore

			return isset( $template_content ) ? json_decode( $template_content, true ) : [];
		} catch ( \Throwable $th ) {
			error_log( 'Error while reading the template file: ' . $th->getMessage() );
			return [];
		}
	}
}

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
		$container['surecart.elementor.seeder']       = function () {
			return new ElementorTemplateSeeder();
		};
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
			add_action( 'elementor/frontend/the_content', array( $this, 'handle_product_page_wrapper' ) );
		}

		// Bootstrap the template seeder.
		$container['surecart.elementor.seeder']->bootstrap();

		// Bootstrap the widgets.
		$container['surecart.elementor.widgets']->bootstrap();

		// Bootstrap the dynamic tags.
		$container['surecart.elementor.dynamic_tags']->bootstrap();

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'elementor_seeder', 'surecart.elementor.seeder' );
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
				'site_url'                        => site_url(),
				'sc_product_template'             => $this->get_product_template(),
				'sc_shop_page_loop_item_template' => $this->get_shop_page_loop_item_template(),
				'sc_shop_page_template'           => $this->get_shop_page_template(),
			]
		);
	}

	/**
	 * Elementor surecart categories register
	 *
	 * @param Obj $elements_manager Elementor category manager.
	 *
	 * @return void
	 */
	public function categories_registered( $elements_manager ) {
		$elements_manager->add_category(
			'surecart-elementor',
			[
				'title' => esc_html__( 'SureCart', 'surecart' ),
				'icon'  => 'fa fa-plug',
			]
		);
	}

	/**
	 * Elementor widget register
	 *
	 * @return void
	 */
	public function widget( $widgets_manager ) {
		$widgets_manager->register( new ReusableFormWidget() );
	}

	/**
	 * Add product theme condition
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Documents_Manager $documents_manager The documents manager.
	 *
	 * @return void
	 */
	public function register_document( $documents_manager ) {
		$documents_manager->register_document_type( 'surecart-product', ProductDocument::get_class_full_name() );
	}

	/**
	 * Add product theme condition
	 *
	 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Conditions_Manager $conditions_manager The conditions manager.
	 *
	 * @return void
	 */
	public function product_theme_conditions( $conditions_manager ) {
		$conditions_manager->register_condition_instance( new Conditions() );
	}

	/**
	 * Handle Elementor content.
	 *
	 * @param string $content The content.
	 *
	 * @return string
	 */
	public function handle_product_page_wrapper( string $content ): string {
		return ( new ProductPageWrapperService( $content ) )->wrap();
	}

	/**
	 * Get SureCart product template.
	 *
	 * @return array
	 */
	public function get_product_template(): array {
		return $this->get_elementor_template_from_file( 'surecart-single-product.json' );
	}

	/**
	 * Get SureCart shop page loop item template.
	 *
	 * @return array
	 */
	public function get_shop_page_loop_item_template(): array {
		return $this->get_elementor_template_from_file( 'surecart-shop-page-loop-item.json' );
	}

	/**
	 * Get SureCart shop page template.
	 *
	 * @return array
	 */
	public function get_shop_page_template(): array {
		$template = $this->get_elementor_template_from_file( 'surecart-shop-page.json' );

		// Add the shop page loop item template as template_id.
		$loop_template = \SureCart::elementor_seeder()->getShopPageLoopItemTemplate();
		$template_id   = $loop_template->ID ?? $loop_template ?? '';

		if ( ! empty( $template_id ) ) {
			$template['content'][0]['elements'][0]['settings']['template_id'] = $template_id;
		}

		return $template;
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
			$template_content = file_get_contents( $template_path );

			return isset( $template_content ) ? json_decode( $template_content, true ) : [];
		} catch ( \Throwable $th ) {
			error_log( 'Error while reading the template file: ' . $th->getMessage() );
			return [];
		}
	}
}

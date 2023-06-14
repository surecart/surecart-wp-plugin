<?php
namespace SureCart\Controllers\Web;

use SureCart\Models\Form;

/**
 * Handles webhooks
 */
abstract class ProductTypePageController {
	/**
	 * Product.
	 *
	 * @var \SureCart\Models\Product
	 */
	protected $product;

	/**
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters() {
		// set the document title.
		add_filter( 'document_title_parts', [ $this, 'documentTitle' ] );
		// disallow pre title filter.
		add_filter( 'pre_get_document_title', [ $this, 'disallowPreTitle' ], 214748364 );
		// add edit product link.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );
		// add scripts.
		add_action( 'wp_enqueue_scripts', [ $this, 'scripts' ] );
		// preload image.
		add_action( 'wp_head', [ $this, 'preloadImage' ] );
		// maybe add json schema.
		add_action( 'wp_head', [ $this, 'displaySchema' ] );
		// add meta title and description.
		add_action( 'wp_head', [ $this, 'addSeoMetaData' ] );

		// add data needed for product to load.
		add_filter(
			'surecart-components/scData',
			function( $data ) {
				$form = \SureCart::forms()->getDefault();

				$data['product_data'] = [
					'product'       => $this->product,
					'form'          => $form,
					'mode'          => Form::getMode( $form->ID ),
					'checkout_link' => \SureCart::pages()->url( 'checkout' ),
				];

				return $data;
			}
		);
	}

	/**
	 * Add meta title and description.
	 *
	 * @return void
	 */
	public function addSeoMetaData() {

		?>
		<!-- Primary Meta -->
		<meta name="title" content="<?php echo esc_attr( sanitize_text_field( $this->product->page_title ) ); ?>">
		<meta name="description" content="<?php echo esc_attr( sanitize_text_field( $this->product->meta_description ) ); ?>">

		<!-- Open Graph -->
		<meta property="og:locale" content="<?php echo esc_attr( get_locale() ); ?>" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="<?php echo esc_attr( $this->product->page_title ); ?>" />
		<meta property="og:description" content="<?php echo esc_attr( sanitize_text_field( $this->product->meta_description ) ); ?>" />
		<meta property="og:url" content="<?php echo esc_url( $this->product->permalink ); ?>" />
		<meta property="og:site_name" content="<?php bloginfo( 'name' ); ?>" />
		<?php if ( ! empty( $this->product->image_url ) ) { ?>
			<meta property="og:image" content="<?php echo esc_url( $this->product->getImageUrl( 800 ) ); ?>" />
		<?php } ?>
		<?php
	}

	/**
	 * Display the JSON Schema.
	 *
	 * @return void
	 */
	public function displaySchema() {
		$schema = $this->product->getJsonSchemaArray();
		if ( empty( $schema ) ) {
			return;
		}
		?>
		<script type="application/ld+json"><?php echo wp_json_encode( $schema ); ?></script>
		<?php
	}

	/**
	 * Preload the product image.
	 *
	 * @return void
	 */
	public function preloadImage() {
		if ( empty( $this->product->image_url ) ) {
			return;
		}
		?>
		<link rel="preload" href="<?php echo esc_url( $this->product->image_url ); ?>" as="image">
		<?php
	}

	/**
	 * Update the document title name to match the product name.
	 *
	 * @param array $parts The parts of the document title.
	 */
	public function documentTitle( $parts ) {
		$parts['title'] = esc_html( sanitize_text_field( $this->product->page_title ?? $parts['title'] ) );
		return $parts;
	}

	/**
	 * Disallow the pre title.
	 *
	 * @param string $title The title.
	 *
	 * @return string
	 */
	public function disallowPreTitle( $title ) {
		if ( ! empty( $this->product->id ) ) {
			return '';
		}
		return $title;
	}

	/**
	 * Add edit links
	 *
	 * @param \WP_Admin_bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addEditProductLink( $wp_admin_bar ) {
		if ( empty( $this->product->id ) ) {
			return;
		}
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $this->product->id ) ),
			]
		);
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function scripts() {
		\SureCart::assets()->enqueueComponents();
		wp_localize_script(
			'surecart-components',
			'sc',
			[
				'store' => (object) [],
			]
		);
		// add data for product store here.
	}

	/**
	 * Handle fetching error.
	 *
	 * @param \WP_Error $wp_error
	 *
	 * @return void
	 */
	public function handleError( \WP_Error $wp_error ) {
		$data = (array) $wp_error->get_error_data();
		if ( 404 === ( $data['status'] ?? null ) ) {
			return $this->notFound();
		}
		wp_die( esc_html( implode( ' ', $wp_error->get_error_messages() ) ) );
	}

	/**
	 * Handle not found error.
	 *
	 * @return void
	 */
	public function notFound() {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		get_template_part( 404 );
		exit();
	}
}

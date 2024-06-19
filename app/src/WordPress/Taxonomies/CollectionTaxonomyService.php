<?php

namespace SureCart\WordPress\Taxonomies;

/**
 * Form post type service class.
 */
class CollectionTaxonomyService {
	/**
	 * The post type slug.
	 *
	 * @var string
	 */
	protected $slug = 'sc_collection';

	/**
	 * Bootstrap service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', array( $this, 'register' ) );
		add_filter( 'taxonomy_template', array( $this, 'template' ) );
		add_action( "{$this->slug}_edit_form_fields", array( $this, 'category_edit_form_fields' ) );
		add_action( "{$this->slug}_add_form_fields", array( $this, 'category_edit_form_fields' ) );
	}

	/**
	 * Get the template for the taxonomy.
	 *
	 * @param string $template The template.
	 *
	 * @return string
	 */
	public function template( $template ) {
		// the theme has provided a taxonomy template, or we are not on the collection taxonomy.
		if ( ! empty( $template ) || ! is_tax( $this->slug ) ) {
			return $template;
		}

		// check if we are on the collection taxonomy.
		return plugin_dir_path( SURECART_PLUGIN_FILE ) . '/templates/pages/template-surecart-collection.php';
	}

	/**
	 * Add the form fields to the category edit form.
	 *
	 * @param object $term The term object.
	 *
	 * @return void
	 */
	public function category_edit_form_fields( $term ) {
		$term_id   = $term->term_id;
		$term_meta = get_term_meta( $term_id );

		// list all template parts.
		$templates = get_block_templates(
			array(),
		);

		// filter templates to only show custom product collection templates.
		$templates = array_filter(
			$templates,
			function ( $template ) {
				return 0 === strpos( $template->slug, 'sc - product - collection' );
			}
		);
		?>

		<tr class="form-field">
			<th scope="row" valign="top">
				<label for="term_meta[_wp_page_template]"><?php esc_html_e( 'Template', 'surecart' ); ?></label>
			</th>
			<td>
				<select name="term_meta[_wp_page_template]" id="term_meta[_wp_page_template]">
					<option value=""><?php esc_html_e( 'default Template', 'surecart' ); ?></option>
					<?php
					foreach ( $templates as $template ) {
						?>
						<option value="<?php echo esc_attr( $template->slug ); ?>" <?php selected( $term_meta['_wp_page_template'][0], $template->ID ); ?>><?php echo wp_kses_post( $template->title ); ?></option>
						<?php
					}
					?>
				</select>
				<p class="description"><?php esc_html_e( 'Select a template for the collection', 'surecart' ); ?></p>
			</td>
		</tr>
		<?php
	}

	/**
	 * Register the taxonomy
	 *
	 * @return void
	 */
	public function register() {
		register_taxonomy(
			$this->slug,
			array( 'sc_product' ),
			array(
				'label'             => __( 'Collections', 'surecart' ),
				'labels'            => array(
					'name'              => _x( 'Collections', 'taxonomy general name', 'surecart' ),
					'singular_name'     => _x( 'Collection', 'taxonomy singular name', 'surecart' ),
					'search_items'      => __( 'Search Collections', 'surecart' ),
					'all_items'         => __( 'All Collections', 'surecart' ),
					'parent_item'       => __( 'parent Collection', 'surecart' ),
					'parent_item_colon' => __( 'parent Collection:', 'surecart' ),
					'edit_item'         => __( 'Edit Collection', 'surecart' ),
					'update_item'       => __( 'Update Collection', 'surecart' ),
					'add_new_item'      => __( 'Add New Collection', 'surecart' ),
					'new_item_name'     => __( 'New Collection Name', 'surecart' ),
					'menu_name'         => __( 'Collection', 'surecart' ),
				),
				'public '           => true,
				'show_in_rest'      => true,
				'hierarchical'      => false,
				'show_in_ui'        => true,
				'show_admin_column' => true,
				'rewrite'           => array(
					'slug'       => \SureCart::settings()->permalinks()->getBase( 'collection_page' ),
					'with_front' => false,
				),
			)
		);
	}
}

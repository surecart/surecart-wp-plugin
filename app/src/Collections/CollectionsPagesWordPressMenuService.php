<?php

namespace SureCart\Collections;

use SureCart\Models\ProductCollection;

/**
 * Service for collection pages in WordPress menu related functions.
 */
class CollectionsPagesWordPressMenuService {
	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', array( $this, 'register_nav_meta_box' ), 9 );
	}

	/**
	 * Adds the meta box container
	 *
	 * @return void
	 */
	public function register_nav_meta_box() {
		global $pagenow;

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return;
		}

		if ( 'nav-menus.php' === $pagenow ) {
			add_meta_box(
				'sc_collections_meta_box',
				__( 'SureCart Collections', 'surecart' ),
				array( $this, 'metabox_contents' ),
				'nav-menus',
				'side',
				'high'
			);
		}
	}

	/**
	 * Show the Meta Menu settings
	 *
	 * @return void
	 */
	public function metabox_contents() {
		$this->render_collection_pages_menu_options();
	}

	/**
	 * Render the collection pages menu options.
	 * 
	 * @return void
	 */
	public function render_collection_pages_menu_options() {

		$collections = ProductCollection::get();

		?>
		<div id="posttype-sc-collections" class="posttypediv">
			<div id="tabs-panel-sc-collections" class="tabs-panel tabs-panel-active">
				<ul id="sc-collections-checklist" class="categorychecklist form-no-clear">
					<?php
					$i = -1;
					foreach ( $collections as $collection ) :
						$name = $collection->name;
						?>
						<li>
							<label class="menu-item-title">
								<input type="checkbox" class="menu-item-checkbox" name="menu-item[<?php echo esc_attr( $i ); ?>][menu-item-object-id]" value="<?php echo esc_attr( $i ); ?>" /> <?php echo esc_html( $name ); ?>
							</label>
							<input type="hidden" class="menu-item-type" name="menu-item[<?php echo esc_attr( $i ); ?>][menu-item-type]" value="custom" />
							<input type="hidden" class="menu-item-title" name="menu-item[<?php echo esc_attr( $i ); ?>][menu-item-title]" value="<?php echo esc_attr( $name ); ?>" />
							<input type="hidden" class="menu-item-url" name="menu-item[<?php echo esc_attr( $i ); ?>][menu-item-url]" value="<?php echo esc_url( get_site_url( null, 'collections/' . $collection->slug ) ); ?>" />
							<input type="hidden" class="menu-item-classes" name="menu-item[<?php echo esc_attr( $i ); ?>][menu-item-classes]" />
						</li>
						<?php
						$i--;
					endforeach;
					?>
				</ul>
			</div>
			<p class="button-controls" data-items-type="posttype-sc-collections">
				<span class="list-controls">
					<label>
						<input type="checkbox" class="select-all" />
						<?php esc_html_e( 'Select all', 'woocommerce' ); ?>
					</label>
				</span>
				<span class="add-to-menu">
					<button type="submit" class="button-secondary submit-add-to-menu right" value="<?php esc_attr_e( 'Add to menu', 'woocommerce' ); ?>" name="add-post-type-menu-item" id="submit-posttype-sc-collections"><?php esc_html_e( 'Add to menu', 'woocommerce' ); ?></button>
					<span class="spinner"></span>
				</span>
			</p>
		</div>
		<?php
	}
}

<?php

namespace SureCart\Integrations\Elementor;

/**
 * Class to handle elementor dynamic tags.
 */
class ElementorDynamicTagsService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'elementor/dynamic_tags/register', [ $this, 'registerDynamicTags' ] );
		add_action( 'elementor/dynamic_tags/register', [ $this, 'registerDynamicDataGroups' ] );
	}

	/**
	 * Register the dynamic tags.
	 *
	 * @param \Elementor\DynamicTagsManager $dynamic_tags_manager Dynamic tags manager.
	 *
	 * @return void
	 */
	public function registerDynamicTags( $dynamic_tags_manager ) {
		if ( ! class_exists( '\Elementor\Core\DynamicTags\Tag' ) ) {
			return;
		}

		foreach ( glob( __DIR__ . '/DynamicTags/*.php' ) as $file ) {
			if ( ! is_readable( $file ) ) {
				continue;
			}

			require_once $file;
			$get_declared_classes = get_declared_classes();
			$tag_class_name       = end( $get_declared_classes );

			$dynamic_tags_manager->register_tag( new $tag_class_name() );
		}
	}

	/**
	 * Register the dynamic data groups.
	 *
	 * @param \Elementor\DynamicTagsManager $dynamic_tags_manager Dynamic tags manager.
	 *
	 * @return void
	 */
	public function registerDynamicDataGroups( $dynamic_tags_manager ) {
		$dynamic_tags_manager->register_group(
			'surecart-product',
			array(
				'title' => esc_html__( 'SureCart Product', 'surecart' ),
			)
		);
	}
}

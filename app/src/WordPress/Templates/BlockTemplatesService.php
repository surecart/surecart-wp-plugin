<?php

namespace SureCart\WordPress\Templates;

/**
 * The block templates service.
 */
class BlockTemplatesService {
	/**
	 * Holds the path for the directory where the block templates will be kept.
	 *
	 * @var string
	 */
	private $templates_directory;

	/**
	 * Holds the path for the directory where the block template parts will be kept.
	 *
	 * @var string
	 */
	private $template_parts_directory;

	/**
	 * Set the directories where the block templates will be kept.
	 *
	 * @param \Pimple\Container $container Service container.
	 */
	public function __construct( $templates_directory, $template_parts_directory ) {
		$root_path                      = trailingslashit( $container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . '/templates/';
		$this->templates_directory      = $templates_directory;
		$this->template_parts_directory = $template_parts_directory;
	}

	/**
	 * Gets the directory where templates of a specific template type can be found.
	 *
	 * @param string $template_type wp_template or wp_template_part.
	 *
	 * @return string
	 */
	protected function getTemplatesDirectory( $template_type = 'wp_template' ) {
		if ( 'wp_template_part' === $template_type ) {
			return $this->template_parts_directory;
		}
		return $this->templates_directory;
	}
}

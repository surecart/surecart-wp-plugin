<?php

namespace SureCartBlocks\Blocks;

use SureCartBlocks\Util\BlockStyleAttributes;

/**
 * Checkout block
 */
abstract class BaseBlock {
	/**
	 * Optional directory to .json block data files.
	 *
	 * @var string
	 */
	protected $directory = '';

	/**
	 * Holds the block.
	 *
	 * @var object
	 */
	protected $block;

	/**
	 * Get the class name for the color.
	 *
	 * @param string $color_context_name The color context name (color, background-color).
	 * @param string $color_slug (foreground, background, etc.).
	 *
	 * @return string
	 */
	public function getColorClassName( $color_context_name, $color_slug ) {
		if ( ! $color_context_name || ! $color_slug ) {
			return false;
		}
		$color_slug = _wp_to_kebab_case( $color_slug );
		return "has-$color_slug-$color_context_name";
	}

	/**
	 * Get the classes.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	public function getClasses( $attributes ) {
		// get block classes and styles.
		[ 'classes' => $classes ] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );
		// get text align class.
		['class' => $text_align_class] = BlockStyleAttributes::getTextAlignClassAndStyle( $attributes );
		// get text align class.
		[ 'class' => $align_class ] = BlockStyleAttributes::getAlignClassAndStyle( $attributes );
		return implode( ' ', array_filter( [ $classes, $text_align_class, $align_class ] ) );
	}

	/**
	 * Get the styles
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	public function getStyles( $attributes ) {
		[ 'styles' => $styles ] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );
		return $styles;
	}

	/**
	 * Get the spacing preset css variable.
	 *
	 * @param string $value The value.
	 *
	 * @return string|void
	 */
	public function getSpacingPresetCssVar( $value ) {
		if ( ! $value ) {
			return;
		}

		preg_match( '/var:preset\|spacing\|(.+)/', $value, $matches );

		if ( ! $matches ) {
			return $value;
		}

		return "var(--wp--preset--spacing--$matches[1])";
	}


	/**
	 * Register the block for dynamic output
	 *
	 * @param \Pimple\Container $container Service container.
	 *
	 * @return void
	 */
	public function register() {
		register_block_type_from_metadata(
			$this->getDir(),
			apply_filters(
				'surecart/block/registration/args',
				[ 'render_callback' => [ $this, 'preRender' ] ],
			),
		);
	}

	/**
	 * Get the called class directory path
	 *
	 * @return string
	 */
	public function getDir() {
		if ( $this->directory ) {
			return $this->directory;
		}

		$reflector = new \ReflectionClass( $this );
		$fn        = $reflector->getFileName();
		return dirname( $fn );
	}


	/**
	 * Optionally run a function to modify attibuutes before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 *
	 * @return function
	 */
	public function preRender( $attributes, $content, $block ) {
		$this->block = $block;

		// run middlware.
		$render = $this->middleware( $attributes, $content );

		if ( is_wp_error( $render ) ) {
			return $render->get_error_message();
		}

		if ( true !== $render ) {
			return $render;
		}

		$attributes = $this->getAttributes( $attributes );

		// render.
		return $this->render( $attributes, $content, $block );
	}

	/**
	 * Run any block middleware before rendering.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content   Post content.
	 * @return boolean|\WP_Error;
	 */
	protected function middleware( $attributes, $content ) {
		return true;
	}

	/**
	 * Allows filtering of attributes before rendering.
	 *
	 * @param array $attributes Block attributes.
	 * @return array $attributes
	 */
	public function getAttributes( $attributes ) {
		return $attributes;
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		return '';
	}
}

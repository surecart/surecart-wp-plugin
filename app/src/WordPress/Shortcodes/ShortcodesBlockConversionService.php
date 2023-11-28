<?php

namespace SureCart\WordPress\Shortcodes;

class ShortcodesBlockConversionService {
    /**
     * Holds the attributes.
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Holds the content.
     *
     * @var string
     */
    protected $content = '';

    /**
     * Get things going
     *
     * @param array  $attributes Attributes.
     * @param string $content Content.
     */
    public function __construct( $attributes, $content ) {
        $this->attributes = $attributes;
        $this->content    = $content;
    }

    /**
     * Convert the block
     *
     * @param string $name Block name.
     * @param string $block Block class.
     * @param array  $defaults Default attributes.
     *
     * @return string
     */
    public function convert( $name, $block, $defaults = [] ) {
        $attributes = shortcode_atts(
                    $defaults,
                    $this->attributes,
                    $name
                );

        $block_content = '';
        $parent = \WP_Block_Supports::$block_to_render;
        \WP_Block_Supports::$block_to_render = [
            'blockName' => $name,
            'attributes' => $attributes,
            'render' => function( $attributes, $content ) use ( $block ) {
                return (new $block())->render($attributes,$content);
            }
        ];

        $block_content = call_user_func(
            \WP_Block_Supports::$block_to_render['render'],
            $attributes,
            do_shortcode($this->content)
        );

        \WP_Block_Supports::$block_to_render = $parent;

        return $block_content;
    }
}

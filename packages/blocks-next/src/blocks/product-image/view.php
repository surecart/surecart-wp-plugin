<?php
    
    $sizing = $attributes['sizing'] ? 'contain' === $attributes['sizing'] ? ' is_contained' : ' is_covered' : ' is_covered';
    $aspect_ratio = ! empty( $attributes['aspectRatio'] )
		? esc_attr( safecss_filter_attr( 'aspect-ratio:' . $attributes['aspectRatio'] ) ) . ';'
		: '';
	$width        = ! empty( $attributes['width'] )
		? esc_attr( safecss_filter_attr( 'width:' . $attributes['width'] ) ) . ';'
		: '';
	$height       = ! empty( $attributes['height'] )
		? esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . ';'
		: '';

    if ( ! $height && ! $width && ! $aspect_ratio ) {
        $wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'product-img ' . $class . $sizing ) );
    } else {
        $wrapper_attributes = get_block_wrapper_attributes( array( 'style' => $aspect_ratio . $width . $height, 'class' => 'product-img ' . $class . $sizing ) );
    }
?>
<div
    <?php echo $wrapper_attributes; ?>
>
    <img data-wp-bind--src="context.product.featured_media.src"/>
</div>

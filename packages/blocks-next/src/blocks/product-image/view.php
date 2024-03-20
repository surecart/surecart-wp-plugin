<?php
    $styles = sc_get_block_styles();
    $style = $styles['css'] ?? '';
    $class = $styles['classnames'] ?? '';
    $sizing = $attributes['sizing'] ? 'contain' === $attributes['sizing'] ? ' is_contained' : ' is_covered' : ' is_covered';
?>
<div
    <?php echo get_block_wrapper_attributes( array( 'class' => 'product-img ' . $class . $sizing ) ); ?>
    style="<?php echo esc_attr( $style ); ?>"
>
    <img data-wp-bind--src="context.product.featured_media.src"/>
</div>

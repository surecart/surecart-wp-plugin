<?php
    $styles = sc_get_block_styles();
    $style = $styles['css'] ?? '';
    $class = $styles['classnames'] ?? '';
?>
<img 
    <?php echo get_block_wrapper_attributes( array( 'class' => 'product-img' . $class ) ); ?> 
    style="<?php echo esc_attr( $style ); ?>"
    data-wp-bind--src="context.product.featured_media.src"
></img>

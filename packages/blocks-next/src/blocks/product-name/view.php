<?php
    $styles = sc_get_block_styles();
    $style = $styles['css'] ?? '';
    $class = $styles['classnames'] ?? '';
?>

<div 
    <?php echo get_block_wrapper_attributes( array( 'class' => 'product-item-title ' . $class ) ); ?> 
    style="<?php echo esc_attr( $style ); ?>"
    data-wp-text="context.product.name"
></div>

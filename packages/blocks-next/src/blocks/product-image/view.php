<?php
    $styles = sc_get_block_styles();
    $style = $styles['css'] ?? '';
    $class = $styles['classnames'] ?? '';
?>
<div 
    <?php echo get_block_wrapper_attributes( array( 'class' => 'product-img' . $class ) ); ?> 
    style=<?php echo esc_attr( $style ); ?>
></div>

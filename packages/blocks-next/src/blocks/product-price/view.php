<?php
    $styles = sc_get_block_styles();
    $style = $styles['css'] ?? '';
    $class = $styles['classnames'] ?? '';
?>

<div 
    <?php echo get_block_wrapper_attributes( array( 'class' => 'product-price' . $class ) ); ?>
    <?php echo $attributes['range'] ? ' data-wp-text="context.product.range_display_amount"' : ' data-wp-text="context.product.display_amount"'; ?>
    style=<?php echo esc_attr( $style ); ?>
></div>

<div
    <?php echo get_block_wrapper_attributes(); ?>
    style=<?php echo esc_attr( $style ); ?>
>
    <template data-wp-each="context.pages" >
        <a 
            data-wp-bind--href="context.item.href"
            data-wp-text="context.item.name"
            data-wp-key="context.item.key"
            data-wp-on--click="surecart/product-list::actions.navigate" 
            data-wp-on--mouseenter="surecart/product-list::actions.prefetch" 
            data-wp-watch="surecart/product-list::callbacks.prefetch" 
        ></a>
    </template>
</div>
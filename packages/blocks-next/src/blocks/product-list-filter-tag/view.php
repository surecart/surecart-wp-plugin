<a
    data-wp-bind--key="context.collection.id"
    data-wp-bind--id="context.collection.id"
    data-wp-bind--href="context.collection.href"
    data-wp-on--click="surecart/product-list::actions.navigate"
    data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
    <?php echo get_block_wrapper_attributes( [
        'class' => 'sc-tag sc-tag--default sc-tag--medium',
        'style' =>'cursor: pointer; text-decoration: none;'
    ] ); ?>
>
    <span class="tag__content" data-wp-text="context.collection.name"></span>
    <?php echo SureCart::svg()->get( 'x', [ 'class' => 'sc-tag__clear', 'aria-label' => __('Remove tag', 'surecart') ] ); ?>
</a>

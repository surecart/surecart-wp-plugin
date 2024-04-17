<div <?php echo get_block_wrapper_attributes(); ?>>
    <template data-wp-each--page="context.pages" data-wp-key="context.page.href">
		<span> <?php /** This span is needed to prevent a javascript issue with interactivity api */ ?>
			<a
				data-wp-bind--href="context.page.href"
				data-wp-text="context.page.name"
				data-wp-on--click="surecart/product-list::actions.navigate"
				data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
				data-wp-watch="surecart/product-list::callbacks.prefetch"
			></a>
		</span>
    </template>
</div>

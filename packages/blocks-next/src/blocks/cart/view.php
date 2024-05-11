<div
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context([])); ?>
    data-wp-interactive='{ "namespace": "surecart/cart" }'
    data-wp-init="callbacks.fetchCheckouts"
>
    <?php echo do_blocks( $content ); ?>
</div>

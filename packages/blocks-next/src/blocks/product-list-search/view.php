<form 
    <?php echo get_block_wrapper_attributes( array( 'class' => $class . 'sc-input-group' ) ); ?> 
    style="<?php 
		echo esc_attr($style); 
	?>"
    data-wp-on--submit="actions.onSearchSubmit"
>
    <?php echo $content; ?>
</form>
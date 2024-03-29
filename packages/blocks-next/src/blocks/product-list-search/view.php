<form 
    <?php echo get_block_wrapper_attributes( array( 'class' => $class . 'sc-input-group' ) ); ?> 
    style="<?php 
		echo 'flex-direction: row;';
		echo esc_attr($style); 
	?>"
>
    <?php echo $content; ?>
</form>
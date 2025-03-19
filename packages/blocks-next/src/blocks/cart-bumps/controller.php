<?php


// only enqueue if we are needing a slideshow.
wp_enqueue_style( 'surecart-image-slider' );
wp_enqueue_script_module( '@surecart/image-slider' );

// handle slideshow.
$slider_options = array(
	'sliderOptions' => array(
		'slidesPerView'  => 'auto',
		'autoHeight'     => true,
		'spaceBetween'   => 40,
		'centeredSlides' => true,
	),
);

return 'file:./view.php';

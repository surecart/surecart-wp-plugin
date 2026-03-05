<?php
/**
 * Orbit style
 */
register_block_style(
	'surecart/product-quantity',
	array(
		'name'         => 'orbit',
		'label'        => __( 'Orbit', 'surecart' ),
		'inline_style' => '.wp-block-surecart-product-quantity.is-style-orbit .wp-block-surecart-product-quantity-control {
			min-width: 135px;
		}',
		'style_data'   => array(
			'layout' => array(
				'selfStretch' => 'fixed',
				'flexSize'    => '150px',
			),
			'blocks' => array(
				'surecart/product-quantity-control' => array(
					'border'     => array(
						'radius' => '999999px',
					),
					'dimensions' => array(
						'minHeight' => '50px',
					),
					'spacing'    => array(
						'padding'  => '0 10px',
						'blockGap' => '5px',
					),
				),
			),
		),
	)
);

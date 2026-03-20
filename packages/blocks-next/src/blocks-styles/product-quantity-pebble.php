<?php
/**
 * Pebble style
 */
register_block_style(
	'surecart/product-quantity',
	array(
		'name'         => 'pebble',
		'label'        => __( 'Pebble', 'surecart' ),
		'inline_style' => '.wp-block-surecart-product-quantity.is-style-pebble .wp-block-surecart-product-quantity-control {
			min-width: 160px;
		}',
		'style_data'   => array(
			'layout' => array(
				'selfStretch' => 'fixed',
				'flexSize'    => '150px',
			),
			'blocks' => array(
				'surecart/product-quantity-control'        => array(
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
				'surecart/product-quantity-input-increase' => array(
					'color'  => array(
						'background' => 'var(--sc-color-gray-100)',
					),
					'border' => array(
						'radius' => '999999px',
					),
				),
				'surecart/product-quantity-input-decrease' => array(
					'color'  => array(
						'background' => 'var(--sc-color-gray-100)',
					),
					'border' => array(
						'radius' => '999999px',
					),
				),
			),
		),
	)
);

<?php
/**
 * Borderless style
 */
register_block_style(
	'surecart/product-quantity',
	array(
		'name'         => 'borderless',
		'label'        => __( 'Borderless', 'surecart' ),
		'inline_style' => '.wp-block-surecart-product-quantity.is-style-borderless .wp-block-surecart-product-quantity-control {
			min-width: 135px;
		}',
		'style_data'   => array(
			'layout' => array(
				'selfStretch' => 'fixed',
				'flexSize'    => '150px',
			),
			'blocks' => array(
				'surecart/product-quantity-control'        => array(
					'border'  => array(
						'width' => '0',
					),
					'shadow'  => 'none',
					'spacing' => array(
						'padding'  => '0',
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

<?php
/**
 * Default style
 */
register_block_style(
	'surecart/product-quantity',
	array(
		'name'       => 'default',
		'label'      => __( 'Default', 'surecart' ),
		'is_default' => true,
		'style_data' => array(
			'blocks' => array(
				'surecart/product-quantity-control' => array(
					'spacing' => array(
						'blockGap' => '1px',
					),
				),
			),
		),
	)
);

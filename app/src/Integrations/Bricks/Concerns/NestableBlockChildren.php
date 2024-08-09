<?php

namespace SureCart\Integrations\Bricks\Concerns;

/**
 * Nestable block children.
 */
trait NestableBlockChildren {
	/**
	 * Get price choice nested children.
	 *
	 * @return array
	 */
	public function getPriceChoiceNestedChildren() {
		$settings = array(
			'_typography' => array(
				'text-align' => 'right',
			),
		);

		return array(
			array(
				'name'     => 'surecart-product-price-name',
				'settings' => array(
					'_width' => '50%',
				),
			),
			array(
				'name'     => 'block',
				'settings' => array(
					'display'     => 'flex',
					'_direction'  => 'column',
					'_alignItems' => 'flex-end',
					'_width'      => '50%',
				),
				'children' => array(
					array(
						'name'     => 'surecart-product-price-amount',
						'settings' => $settings,
					),
					array(
						'name'     => 'surecart-product-price-trial',
						'settings' => $settings,
					),
					array(
						'name'     => 'surecart-product-price-setup-fee',
						'settings' => $settings,
					),
				),
			),
		);
	}

	/**
	 * Get price chooser nested children.
	 *
	 * @return array
	 */
	public function getPriceChooserNestedChildren() {
		return array(
			array(
				'name'     => 'surecart-product-price-choice-template',
				'settings' => array(
					'_display'        => 'flex',
					'_direction'      => 'row',
					'_justifyContent' => 'flex-start',
					'_alignItems'     => 'center',
					'_width'          => '100%',
				),
				'children' => $this->getPriceChoiceNestedChildren(),
			),
		);
	}

	/**
	 * Get collection tags nested children.
	 *
	 * @return array
	 */
	public function getCollectionTagsNestedChildren() {
		return array(
			array(
				'name'     => 'surecart-product-collection-tag',
				'settings' => array(
					'_width' => 'max-content',
				),
			),
		);
	}

	/**
	 * Get selected price nested children.
	 *
	 * @return array
	 */
	public function getSelectedPriceNestedChildren() {
		$row_block_settings = array(
			'_direction'      => 'row',
			'_justifyContent' => 'flex-start',
			'_alignItems'     => 'baseline',
			'_columnGap'      => '0.5em',
		);

		return array(
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-scratch-amount' ),
					array( 'name' => 'surecart-product-selected-price-amount' ),
					array( 'name' => 'surecart-product-selected-price-interval' ),
					array( 'name' => 'surecart-product-sale-badge' ),
				),
			),
			array(
				'name'     => 'block',
				'settings' => $row_block_settings,
				'children' => array(
					array( 'name' => 'surecart-product-selected-price-trial' ),
					array( 'name' => 'surecart-product-selected-price-fees' ),
				),
			),
		);
	}

	/**
	 * Get variant pills nested children.
	 *
	 * @return array
	 */
	public function getVariantPillsNestedChildren() {
		return array(
			array( 'name' => 'surecart-product-variant-pill' ),
		);
	}

	/**
	 * Get product nested children.
	 *
	 * @return array
	 */
	public function getProductNestedChildren() {
		$left_column_children = array(
			array( 'name' => 'surecart-product-media' ),
		);

		$right_column_children = array(
			array(
				'name'     => 'surecart-product-collection-tags',
				'children' => $this->getCollectionTagsNestedChildren(),
			),
			array( 'name' => 'post-title' ),
			array(
				'name'     => 'surecart-product-selected-price',
				'children' => $this->getSelectedPriceNestedChildren(),
			),
			array( 'name' => 'post-excerpt' ),
			array(
				'name'     => 'surecart-product-price-chooser',
				'children' => $this->getPriceChooserNestedChildren(),
			),
			array(
				'name'     => 'surecart-product-variant-pills',
				'children' => $this->getVariantPillsNestedChildren(),
			),
			array( 'name' => 'surecart-product-quantity' ),
			array( 'name' => 'surecart-product-buy-button' ),
		);

		return array(
			array(
				'name'     => 'container',
				'settings' => array(
					'_direction' => 'row',
					'_columnGap' => '60px',
					'_rowGap'    => '30px',
				),
				'children' => array(
					array(
						'name'     => 'block',
						'label'    => esc_html__( 'Column', 'surecart' ),
						'settings' => array(
							'_width'                  => '50%',
							'_width:mobile_portrait'  => '100%',
							'_width:mobile_landscape' => '100%',
						),
						'children' => $left_column_children,
					),
					array(
						'name'     => 'block',
						'label'    => esc_html__( 'Column', 'surecart' ),
						'settings' => array(
							'_width'                  => '50%',
							'_width:mobile_portrait'  => '100%',
							'_width:mobile_landscape' => '100%',
							'_direction'              => 'column',
							'_rowGap'                 => '0.75em',
						),
						'children' => $right_column_children,
					),
				),
			),
		);
	}

	/**
	 * Get nestable children.
	 *
	 * @return array
	 */
	public function get_nestable_children() {
		switch ( $this->name ) {
			case 'surecart-product-price-chooser':
				return $this->getPriceChooserNestedChildren();
			case 'surecart-product-selected-price':
				return $this->getSelectedPriceNestedChildren();
			case 'surecart-product-collection-tags':
				return $this->getCollectionTagsNestedChildren();
			case 'surecart-product-variant-pills':
				return $this->getVariantPillsNestedChildren();
			case 'surecart-product-page':
				return $this->getProductNestedChildren();
			default:
				return array();
		}
	}
}

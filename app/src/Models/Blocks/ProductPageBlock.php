<?php

namespace SureCart\Models\Blocks;

/**
 * The product list service.
 */
class ProductPageBlock {
	/**
	 * The URL.
	 *
	 * @var object
	 */
	protected $url;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url = \SureCart::block()->urlParams();
	}

	/**
	 * Get the variants query.
	 *
	 * @return array|null
	 */
	public function getVariantsQuery() {
		$product = sc_get_product();

		if ( empty( $product ) || empty( $product->variants->data ?? [] ) ) {
			return null;
		}

		// get the initial defaults if there were no args.
		// we need to turn into slugs for comparison to make sure capitalization,
		// spacing, etc. doesn't matter.
		$initial_defaults = array_reduce(
			$product->variant_options->data ?? [],
			function ( $carry, $option ) {
				$name           = sanitize_title( $option->name );
				$carry[ $name ] = sanitize_title( $option->values[0] );
				return $carry;
			},
			[]
		);

		// use initial defaults to only get args needed.
		$args = [];
		foreach ( $initial_defaults as $key => $value ) {
			$args[ $key ] = $this->url->getArg( $key );
		}

		// merge the args with the initial defaults.
		$attributes = wp_parse_args(
			array_filter( $args ),
			$initial_defaults
		);

		// loop through the attributes.
		$keys = [];
		foreach ( $attributes as $option_name => $value ) {
			// find the option index based on the name.
			$option_index = array_search(
				// get the sanitized option name for comparison.
				sanitize_title( $option_name ),
				// get the sanitized option names for comparison.
				array_map(
					fn( $name ) => sanitize_title( $name ),
					array_column( $product->variant_options->data, 'name' )
				),
				true
			);

			// if the option index is not found, skip.
			$keys[ 'option_' . ( $option_index + 1 ) ] = $value;
		}

		return $keys;
	}

	/**
	 * Get the URL.
	 *
	 * @return object|null
	 */
	public function getSelectedVariant() {
		$product = sc_get_product();

		if ( empty( $product ) || empty( $product->variants->data ?? [] ) ) {
			return null;
		}

		// loop through the attributes.
		$keys = $this->getVariantsQuery();

		$variants = array_values(
			array_filter(
				( $product->variants->data ?? [] ),
				function ( $variant ) use ( $keys ) {
					foreach ( $keys as $key => $value ) {
						if ( sanitize_title( $variant->$key ) !== sanitize_title( $value ) ) {
							return false;
						}
					}
					return true;
				}
			)
		);

		if ( ! empty( $variants[0] ) ) {
			return $variants[0];
		}

		if ( ! empty( $product->first_variant_with_stock ) ) {
			return $product->first_variant_with_stock;
		}

		return $product->variants->data[0] ?? null;
	}

	/**
	 * Get the URL.
	 *
	 * @return object|null
	 */
	public function urlParams() {
		return $this->url;
	}

	/**
	 * Get the context.
	 *
	 * @param array $context The context to add to the existing context.
	 *
	 * @return array
	 */
	public function context( $context = [] ) {
		$product = sc_get_product();
		if ( empty( $product ) ) {
			return [];
		}

		$selected_variant = $this->getSelectedVariant();

		return wp_parse_args(
			$context,
			array(
				'formId'                     => \SureCart::forms()->getDefaultId(),
				'mode'                       => \SureCart\Models\Form::getMode( \SureCart::forms()->getDefaultId() ),
				'checkoutUrl'                => \SureCart::pages()->url( 'checkout' ),
				'urlPrefix'                  => $this->urlParams()->getKey(),
				'product'                    => ! empty( $product ) && ! empty( $product->id ) ? $product->only( [ 'id', 'name', 'has_unlimited_stock', 'available_stock', 'archived', 'permalink', 'preview_image' ] ) : null,
				'selectedPrice'              => ! empty( $product->initial_price ) && ! empty( $product->initial_price->id ) ? $product->initial_price->only(
					[
						'id',
						'archived',
						'amount',
						'display_amount',
						'scratch_amount',
						'scratch_display_amount',
						'ad_hoc',
						'is_on_sale',
						'is_zero_decimal',
						'currency',
						'currency_symbol',
						'converted_ad_hoc_min_amount',
						'converted_ad_hoc_max_amount',
						'setup_fee_text',
						'setup_fee_text_with_punctuation',
						'interval_text',
						'short_interval_text',
						'interval_count_text',
						'payments_text',
						'trial_text',
						'trial_text_with_punctuation',
					]
				) : null,
				'prices'                     => array_map(
					fn( $price ) => $price->only(
						[
							'id',
							'archived',
							'amount',
							'display_amount',
							'scratch_amount',
							'scratch_display_amount',
							'ad_hoc',
							'is_on_sale',
							'is_zero_decimal',
							'currency',
							'currency_symbol',
							'converted_ad_hoc_min_amount',
							'converted_ad_hoc_max_amount',
							'setup_fee_text',
							'interval_text',
							'short_interval_text',
							'interval_count_text',
							'payments_text',
							'trial_text',
						]
					),
					$product->active_prices ?? []
				),
				'variants'                   => array_map(
					fn( $variant ) => $variant->only(
						[
							'id',
							'option_1',
							'option_2',
							'option_3',
							'price',
							'amount',
							'display_amount',
							'available_stock',
							'line_item_image',
							'has_unlimited_stock',
						]
					),
					$product->variants->data ?? array()
				),
				'quantity'                   => 1,
				'busy'                       => false,
				'adHocAmount'                => ( ! empty( $product->initial_price->ad_hoc ) ? $product->initial_price->amount : 0 ) / ( ! empty( $product->initial_price->is_zero_decimal ) ? 1 : 100 ),
				'variantValues'              => array_filter(
					array(
						'option_1' => $selected_variant->option_1 ?? null,
						'option_2' => $selected_variant->option_2 ?? null,
						'option_3' => $selected_variant->option_3 ?? null,
					)
				),
				'text'                       => __( 'Add to Cart', 'surecart' ),
				'outOfStockText'             => __( 'Sold Out', 'surecart' ),
				'unavailableText'            => __( 'Unavailable For Purchase', 'surecart' ),
				'selectComponentOptionsText' => __( 'Select options', 'surecart' ),
				'note'                       => '',
				'noteLabel'                  => '',
				'bundleComponentVariants'    => $this->getInitialBundleComponentVariants( $product ),
				'bundleVariableComponentIds' => $this->getBundleVariableComponentIds( $product ),
				'bundleComponents'           => $this->getBundleComponents( $product ),
			),
		);
	}

	/**
	 * IDs of bundle components with variant options — the only ones the buy
	 * button gates on when unfilled.
	 *
	 * @param object $product The bundle product (or non-bundle — returns []).
	 *
	 * @return array
	 */
	protected function getBundleVariableComponentIds( $product ) {
		if ( empty( $product->bundle ) ) {
			return array();
		}
		$ids = array();
		foreach ( $product->bundle_items->data ?? array() as $item ) {
			$component = $item->component_product ?? null;
			if ( empty( $component ) || empty( $component->variant_options->data ?? array() ) ) {
				continue;
			}
			$ids[] = $component->id;
		}
		return $ids;
	}

	/**
	 * Seed each variable component with a default variant so the bundle PDP
	 * opens valid — parity with the main product's auto-pick.
	 *
	 * @param object $product The bundle product (or non-bundle — returns {}).
	 *
	 * @return object Map of component_product_id -> variant_id.
	 */
	public function getInitialBundleComponentVariants( $product ) {
		if ( empty( $product->bundle ) ) {
			return (object) array();
		}

		$map = array();
		foreach ( $product->bundle_items->data ?? array() as $item ) {
			$component = $item->component_product ?? null;
			if ( empty( $component ) || empty( $component->id ) ) {
				continue;
			}

			$initial = $this->findInitialBundleComponentVariant( $component );
			if ( ! empty( $initial->id ) ) {
				$map[ $component->id ] = $initial->id;
			}
		}

		return (object) $map;
	}

	/**
	 * Pick a sensible default variant for a bundle component product.
	 *
	 * @param object $component Component product.
	 *
	 * @return object|null
	 */
	public function findInitialBundleComponentVariant( $component ) {
		$variants = $component->variants->data ?? array();
		if ( empty( $variants ) ) {
			return null;
		}

		$from_url = $this->findBundleComponentVariantFromUrl( $component );
		if ( $from_url ) {
			return $from_url;
		}

		if ( ! empty( $component->has_unlimited_stock ) ) {
			return $variants[0];
		}

		foreach ( $variants as $variant ) {
			if ( ( $variant->available_stock ?? 0 ) > 0 ) {
				return $variant;
			}
		}

		// Nothing in stock — fall back to the first variant.
		return $variants[0];
	}

	/**
	 * Resolve a component's variant from URL slugs (written by setBundleComponentOption).
	 *
	 * @param object $component Component product.
	 *
	 * @return object|null
	 */
	public function findBundleComponentVariantFromUrl( $component ) {
		$variant_options = $component->variant_options->data ?? array();
		$variants        = $component->variants->data ?? array();
		if ( empty( $variant_options ) || empty( $variants ) ) {
			return null;
		}

		$selected_values = array();
		foreach ( $variant_options as $key => $option ) {
			$arg_key  = 'bundle-' . $component->id . '-' . sanitize_title( $option->name );
			$arg_slug = $this->url->getArg( $arg_key );
			if ( empty( $arg_slug ) ) {
				continue;
			}

			foreach ( $option->values as $value ) {
				if ( sanitize_title( $value ) === sanitize_title( $arg_slug ) ) {
					$selected_values[ 'option_' . ( $key + 1 ) ] = $value;
					break;
				}
			}
		}

		if ( empty( $selected_values ) ) {
			return null;
		}

		foreach ( $variants as $variant ) {
			$match = true;
			foreach ( $selected_values as $option_key => $value ) {
				if ( ( $variant->{$option_key} ?? null ) !== $value ) {
					$match = false;
					break;
				}
			}
			if ( $match ) {
				return $variant;
			}
		}

		return null;
	}

	/**
	 * Stock-only snapshot of each bundle component (drives sold-out state).
	 *
	 * @param object $product The bundle product (or non-bundle — returns {}).
	 *
	 * @return object Map of component_product_id -> stock metadata.
	 */
	protected function getBundleComponents( $product ) {
		if ( empty( $product->bundle ) ) {
			return (object) array();
		}

		$components = array();
		foreach ( $product->bundle_items->data ?? array() as $item ) {
			$component = $item->component_product ?? null;
			if ( empty( $component ) || empty( $component->id ) ) {
				continue;
			}

			$components[ $component->id ] = array(
				'has_unlimited_stock' => ! empty( $component->has_unlimited_stock ),
				'available_stock'     => (int) ( $component->available_stock ?? 0 ),
				'variants'            => array_map(
					fn( $variant ) => array(
						'id'              => $variant->id,
						'available_stock' => (int) ( $variant->available_stock ?? 0 ),
					),
					$component->variants->data ?? array()
				),
			);
		}

		return (object) $components;
	}

	/**
	 * Get the state.
	 *
	 * @param array $state The state to add to the existing state.
	 *
	 * @return array
	 */
	public function state( $state = [] ) {
		$product = sc_get_product();
		if ( empty( $product ) ) {
			return [];
		}
		$selected_price   = $product->initial_price;
		$selected_variant = $this->getSelectedVariant();

		return wp_parse_args(
			$state,
			[
				'quantity'                           => 1,
				'selectedDisplayAmount'              => $product->display_amount,
				'isOnSale'                           => function () {
					$context        = wp_interactivity_get_context();
					$selected_price = $context['selectedPrice'] ?? [];
					return $selected_price['is_on_sale'] ?? false;
				},
				'selectedAmount'                     => function () {
					$context        = wp_interactivity_get_context();
					$state          = wp_interactivity_state();
					$selected_price = $context['selectedPrice'] ?? [];
					$prices         = $context['prices'] ?? [];

					if ( ! empty( $prices ) && count( $prices ) > 1 ) {
						return $selected_price['amount'];
					}

					return $state['selectedVariant']['amount'] ?? $selected_price['amount'];
				},
				'busy'                               => false,
				'shouldDisplayImage'                 => function () {
					$context = wp_interactivity_get_context();
					$state   = wp_interactivity_state();

					if ( empty( $context['variants'] ) ) {
						return true;
					}

					return $state['isOptionValueSelected']();
				},
				'adHocAmount'                        => ( ! empty( $selected_price->ad_hoc ) ? $selected_price->amount : 0 ) / ( ! empty( $selected_price->is_zero_decimal ) ? 1 : 100 ),
				'selectedVariant'                    => ! empty( $selected_variant ) && ! empty( $selected_variant->id ) ? $selected_variant->only(
					[
						'id',
						'option_1',
						'option_2',
						'option_3',
						'price',
						'amount',
						'display_amount',
						'available_stock',
						'has_unlimited_stock',
					]
				) : [],
				'isOptionUnavailable'                => function () {
					$context        = wp_interactivity_get_context();
					$variants       = $context['variants'];
					$option         = $context['option_value'];
					$product        = $context['product'];
					$variant_values = $context['variantValues'];
					$option_number  = $context['optionNumber'];

					if ( 1 === $option_number ) {
						$items = array_filter( $variants ?? [], fn( $v ) => $v['option_1'] === $option );
						return self::isVariantGroupSoldOut( $items, $product );
					}

					if ( 2 === $option_number ) {
						$items = array_filter(
							$variants ?? [],
							fn( $v ) => $v['option_1'] === $variant_values['option_1'] && $v['option_2'] === $option
						);
						return self::isVariantGroupSoldOut( $items, $product );
					}

					$items = array_filter(
						$variants ?? [],
						fn( $v ) => $v['option_1'] === $variant_values['option_1'] && $v['option_2'] === $variant_values['option_2'] && $v['option_3'] === $option
					);
					return self::isVariantGroupSoldOut( $items, $product );
				},
				'isOptionValueSelected'              => function () {
					$context = wp_interactivity_get_context();

					if ( empty( $context['optionValue'] ) ) {
						return true;
					}

					$values = array_map(
						function ( $value ) {
							return strtolower( $value );
						},
						array_values( $context['variantValues'] )
					);

					return in_array( strtolower( $context['optionValue'] ), $values );
				},
				'imageDisplay'                       => function () {
					$state = wp_interactivity_state();
					return $state['shouldDisplayImage']() ? 'inherit' : 'none';
				},
				'isSoldOut'                          => function () {
					$context = wp_interactivity_get_context();
					$state   = wp_interactivity_state();
					$product = $context['product'] ?? [];
					if ( empty( $product ) ) {
						return false;
					}
					$variant = $state['selectedVariant'] ?? [];
					if ( ! empty( $variant['id'] ) ) {
						return self::effectiveVariantStock( $variant, $product ) <= 0;
					}
					if ( $product['has_unlimited_stock'] ) {
						return false;
					}
					if ( ! empty( $context['variants'] ) && empty( $variant ) ) {
						return false;
					}
					return $product['available_stock'] <= 0;
				},
				'isUnavailable'                      => function () {
					$context = wp_interactivity_get_context();
					$state   = wp_interactivity_state();
					if ( ! empty( $context['product']->archived ) || ! empty( $state['isSoldOut']() ) ) {
						return true;
					}
					if ( ! empty( $context['variants'] ) && empty( $state['selectedVariant'] ) ) {
						return true;
					}
					if ( ! empty( $state['isBundleIncomplete']() ) ) {
						return true;
					}
					return false;
				},

				// Drives the "Select options" button text and disables Add to cart.
				'isBundleIncomplete'                 => function () {
					$context      = wp_interactivity_get_context();
					$variable_ids = $context['bundleVariableComponentIds'] ?? array();
					if ( empty( $variable_ids ) ) {
						return false;
					}
					// Cast for traversal — server hydration may give stdClass before JS writes.
					$selections = (array) ( $context['bundleComponentVariants'] ?? array() );
					foreach ( $variable_ids as $id ) {
						if ( empty( $selections[ $id ] ) ) {
							return true;
						}
					}
					return false;
				},

				'isBundleComponentOptionSelected'    => function () {
					$context       = wp_interactivity_get_context();
					$option_number = $context['optionNumber'] ?? null;
					$option_value  = $context['option_value'] ?? null;
					$option_values = $context['componentOptionValues'] ?? array();
					$option_values = is_object( $option_values ) ? (array) $option_values : (array) $option_values;
					if ( ! $option_number || null === $option_value ) {
						return false;
					}
					return ( $option_values[ 'option_' . $option_number ] ?? null ) === $option_value;
				},

				// Sold-out pill stays visible (so the full variant matrix is shown) but selecting it disables Add to cart.
				'isBundleComponentOptionUnavailable' => function () {
					$context = wp_interactivity_get_context();
					if ( ! empty( $context['componentHasUnlimitedStock'] ) ) {
						return false;
					}
					$variants      = $context['componentVariants'] ?? array();
					$option_number = (int) ( $context['optionNumber'] ?? 0 );
					$option_value  = $context['option_value'] ?? null;
					$option_values = $context['componentOptionValues'] ?? array();
					$option_values = is_object( $option_values ) ? (array) $option_values : (array) $option_values;

					if ( ! $option_number || null === $option_value ) {
						return false;
					}

					$option_key = 'option_' . $option_number;
					$matching   = array_filter(
						$variants,
						function ( $variant ) use ( $option_key, $option_value, $option_values, $option_number ) {
							// Earlier options must match the current selection.
							for ( $i = 1; $i < $option_number; $i++ ) {
								$prev_key = 'option_' . $i;
								if ( empty( $option_values[ $prev_key ] ) ) {
									continue;
								}
								if ( ( $variant[ $prev_key ] ?? null ) !== $option_values[ $prev_key ] ) {
									return false;
								}
							}
							return ( $variant[ $option_key ] ?? null ) === $option_value;
						}
					);

					if ( empty( $matching ) ) {
						return true;
					}
					$stocks = array_map(
						function ( $v ) {
							return $v['available_stock'] ?? 0;
						},
						$matching
					);
					return max( $stocks ) <= 0;
				},
				'isOptionSelected'                   => function () {
					$context       = wp_interactivity_get_context();
					$option_number = $context['optionNumber'] ?? '';
					if ( ! isset( $context['variantValues'][ "option_$option_number" ] ) || ! isset( $context['option_value'] ) ) {
						return false;
					}
					return $context['variantValues'][ "option_$option_number" ] === $context['option_value'];
				},
				'isPriceSelected'                    => function () {
					$context = wp_interactivity_get_context();
					if ( ! isset( $context['price'] ) || ! isset( $context['selectedPrice'] ) ) {
						return false;
					}
					return $context['price']['id'] === $context['selectedPrice']['id'];
				},
				'buttonText'                         => function () {
					$state   = wp_interactivity_state();
					$context = wp_interactivity_get_context();
					if ( $state['isSoldOut']() ) {
						return $context['outOfStockText'] ?? $context['text'];
					}
					if ( $state['isBundleIncomplete']() ) {
						return $context['selectComponentOptionsText'] ?? $context['text'];
					}
					if ( $state['isUnavailable']() ) {
						return $context['unavailableText'] ?? $context['text'];
					}
					return $context['text'] ?? '';
				},
			]
		);
	}

	/**
	 * Check if a filtered group of variants is sold out.
	 * Returns false (not sold out) when the group is empty — no matching variants means nothing to sell out.
	 *
	 * @param array $items   Filtered variant data arrays.
	 * @param array $product Parent product data for fallback.
	 * @return bool
	 */
	private static function isVariantGroupSoldOut( array $items, array $product ): bool {
		$stocks = array_map( fn( $v ) => self::effectiveVariantStock( $v, $product ), array_values( $items ) );
		if ( empty( $stocks ) ) {
			return false;
		}
		return max( $stocks ) <= 0;
	}

	/**
	 * Get the effective available stock for a variant, respecting variant-level stock overrides.
	 * Returns PHP_INT_MAX when stock is not tracked, it would be then unlimited stock.
	 *
	 * @param array $item    Variant data.
	 * @param array $product Parent product data for fallback.
	 * @return int
	 */
	private static function effectiveVariantStock( array $item, array $product ): int {
		$has_unlimited_stock = $item['has_unlimited_stock'] ?? $product['has_unlimited_stock'] ?? false;
		if ( $has_unlimited_stock ) {
			return PHP_INT_MAX;
		}
		return (int) $item['available_stock'];
	}
}

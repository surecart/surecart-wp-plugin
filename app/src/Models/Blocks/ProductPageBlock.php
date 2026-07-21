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
	 * Per-instance memo of resolved bundle component products, keyed by id.
	 *
	 * @var array
	 */
	private $component_cache = array();

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
	 * Load a bundle component from its own synced post-meta cache by product id.
	 *
	 * A component is a standalone product, so its variants and stock stay current
	 * through the normal product sync (surecart/product_stock_adjusted etc.). We
	 * read the component's own cache rather than a snapshot baked into the bundle,
	 * so a sub-product stock change reflects on the bundle without re-saving it.
	 * Bypasses sc_get_product()'s current-product short-circuit so it resolves the
	 * component even while the bundle is the active product context.
	 *
	 * @param string|null $component_id Component product id.
	 *
	 * @return \SureCart\Models\Product|null
	 */
	public function getBundleComponentProduct( $component_id ) {
		if ( empty( $component_id ) ) {
			return null;
		}

		// Memoize on the instance — context() and state() resolve the same
		// components, so this avoids repeating the lookup within a render.
		if ( array_key_exists( $component_id, $this->component_cache ) ) {
			return $this->component_cache[ $component_id ];
		}

		$posts   = get_posts(
			array(
				'post_type'        => 'sc_product',
				'post_status'      => array( 'publish', 'draft', 'sc_archived', 'private' ),
				'posts_per_page'   => 1,
				'no_found_rows'    => true,
				'suppress_filters' => true,
				'meta_query'       => array(
					array(
						'key'   => 'sc_id',
						'value' => $component_id,
					),
				),
			)
		);
		$product = ! empty( $posts[0] ) ? get_post_meta( $posts[0]->ID, 'product', true ) : null;
		if ( empty( $product ) ) {
			$this->component_cache[ $component_id ] = null;
			return null;
		}

		$decoded                                = is_string( $product ) ? json_decode( $product ) : json_decode( wp_json_encode( $product ) );
		$this->component_cache[ $component_id ] = new \SureCart\Models\Product( $decoded );
		return $this->component_cache[ $component_id ];
	}

	/**
	 * Resolve a bundle component into a product-shaped object carrying its
	 * variants and variant_options.
	 *
	 * Prefers the live shortcut associations on the bundle item (buy page live
	 * fetch carries component_variants / component_variant_options). Falls back to
	 * the component's own synced cache (cached PDP model, where the bundle stores
	 * no component stock) — that cache stays fresh via the component's own product
	 * webhooks. Using the live associations on the buy page is essential: a
	 * component need not be synced as its own WP post, so the cache lookup can miss
	 * it and drop it from the seeded bundle_component_variants.
	 *
	 * @param object $item Bundle item.
	 * @return object|null Component product with variants/variant_options, or null.
	 */
	public function resolveBundleComponent( $item ) {
		if ( empty( $item ) ) {
			return null;
		}

		$component = $item->component_product ?? null;

		// Live associations present (buy page): attach them to the component object.
		if ( is_object( $component ) && ! empty( $item->component_variants->data ?? array() ) ) {
			$component->variants        = $item->component_variants;
			$component->variant_options = $item->component_variant_options ?? (object) array( 'data' => array() );
			return $component;
		}

		// Cached PDP model: read the component's own synced cache.
		return $this->getBundleComponentProduct( $item->component_product_id );
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
			$component = $this->resolveBundleComponent( $item );
			if ( empty( $component->id ) || empty( $component->variant_options->data ?? array() ) ) {
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
			$component = $this->resolveBundleComponent( $item );
			if ( empty( $component->id ) ) {
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
	 * @param object $component Component product (resolved from its own cache).
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
	 * Resolve a component's variant from URL slugs (written by the scope-aware setOption callback).
	 *
	 * @param object $component Component product (resolved from its own cache).
	 *
	 * @return object|null
	 */
	public function findBundleComponentVariantFromUrl( $component ) {
		$variant_options = $component->variant_options->data ?? array();
		$variants        = $component->variants->data ?? array();
		if ( empty( $variant_options ) || empty( $variants ) ) {
			return null;
		}

		// The URL key embeds the component product's slug — matching the writer in
		// packages/blocks-next/src/scripts/product-page/index.js — so a bundle
		// selection reads as ?bundle-{slug}-{option}={value} instead of the UUID.
		// The writer and this reader both look at the same $component, so applying an
		// identical slug→id fallback on each side keeps the two keys in lockstep.
		$identifier = ! empty( $component->slug ) ? $component->slug : $component->id;

		$selected_values = array();
		foreach ( $variant_options as $key => $option ) {
			$arg_key  = 'bundle-' . $identifier . '-' . sanitize_title( $option->name );
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
			$component = $this->resolveBundleComponent( $item );
			if ( empty( $component->id ) ) {
				continue;
			}

			$components[ $component->id ] = array(
				'has_unlimited_stock' => ! empty( $component->has_unlimited_stock ),
				'available_stock'     => (int) ( $component->available_stock ?? 0 ),
				'variants'            => array_map(
					fn( $variant ) => array(
						'id'                  => $variant->id,
						'available_stock'     => (int) ( $variant->available_stock ?? 0 ),
						'has_unlimited_stock' => $variant->has_unlimited_stock,
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
				'quantity'              => 1,
				'selectedDisplayAmount' => $product->display_amount,
				'isOnSale'              => function () {
					$context        = wp_interactivity_get_context();
					$selected_price = $context['selectedPrice'] ?? [];
					return $selected_price['is_on_sale'] ?? false;
				},
				'selectedAmount'        => function () {
					$context        = wp_interactivity_get_context();
					$state          = wp_interactivity_state();
					$selected_price = $context['selectedPrice'] ?? [];
					$prices         = $context['prices'] ?? [];

					if ( ! empty( $prices ) && count( $prices ) > 1 ) {
						return $selected_price['amount'];
					}

					return $state['selectedVariant']['amount'] ?? $selected_price['amount'];
				},
				'busy'                  => false,
				'shouldDisplayImage'    => function () {
					$context = wp_interactivity_get_context();
					$state   = wp_interactivity_state();

					if ( empty( $context['variants'] ) ) {
						return true;
					}

					return $state['isOptionValueSelected']();
				},
				'adHocAmount'           => ( ! empty( $selected_price->ad_hoc ) ? $selected_price->amount : 0 ) / ( ! empty( $selected_price->is_zero_decimal ) ? 1 : 100 ),
				'selectedVariant'       => ! empty( $selected_variant ) && ! empty( $selected_variant->id ) ? $selected_variant->only(
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
				// Scope-aware: the same picker renders for the page product and for
				// each bundle component. resolveVariantScope() resolves which slice
				// of state to read, so this stays free of scope-specific branching.
				'isOptionUnavailable'   => function () {
					$context       = wp_interactivity_get_context();
					$option_number = (int) ( $context['optionNumber'] ?? 0 );
					$option_value  = $context['option_value'] ?? null;
					if ( ! $option_number || null === $option_value ) {
						return false;
					}

					$scope = self::resolveVariantScope( $context );
					return self::isVariantOptionSoldOut(
						$option_number,
						$option_value,
						$scope['values'],
						$scope['variants'],
						$scope['product'],
						$scope['missing_means_unavailable']
					);
				},
				'isOptionValueSelected' => function () {
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
				'imageDisplay'          => function () {
					$state = wp_interactivity_state();
					return $state['shouldDisplayImage']() ? 'inherit' : 'none';
				},
				'isSoldOut'             => function () {
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
				'isUnavailable'         => function () {
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
				'isBundleIncomplete'    => function () {
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

				// Scope-aware via resolveVariantScope(): bundle component selections
				// live in componentOptionValues, page product selections in variantValues.
				'isOptionSelected'      => function () {
					$context       = wp_interactivity_get_context();
					$option_number = $context['optionNumber'] ?? '';
					$option_value  = $context['option_value'] ?? null;
					if ( '' === $option_number || null === $option_value ) {
						return false;
					}
					$scope = self::resolveVariantScope( $context );
					return ( $scope['values'][ "option_$option_number" ] ?? null ) === $option_value;
				},
				'isPriceSelected'       => function () {
					$context = wp_interactivity_get_context();
					if ( ! isset( $context['price'] ) || ! isset( $context['selectedPrice'] ) ) {
						return false;
					}
					return $context['price']['id'] === $context['selectedPrice']['id'];
				},
				'buttonText'            => function () {
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
	 * Resolve the variant scope for the current pill's SSR state.
	 *
	 * Mirrors the JS `getVariantScope` (read half) so the option getters never
	 * branch on "is this a bundle?". A bundle component reads/writes its own
	 * slice; the page product reads the page-level slice. Add a scope here and
	 * the getters keep working unchanged.
	 *
	 * @param array $context Interactivity context for the current pill.
	 * @return array{values:array,variants:array,product:array,missing_means_unavailable:bool}
	 */
	private static function resolveVariantScope( array $context ): array {
		// Bundle component scope.
		if ( ! empty( $context['componentProductId'] ) ) {
			$unlimited = ! empty( $context['componentHasUnlimitedStock'] );
			return array(
				'values'                    => (array) ( $context['componentOptionValues'] ?? array() ),
				'variants'                  => $context['componentVariants'] ?? array(),
				'product'                   => array( 'has_unlimited_stock' => $unlimited ),
				// A component combination with no matching variant can't be built —
				// unless the component is unlimited stock, where every option stays open.
				'missing_means_unavailable' => ! $unlimited,
			);
		}

		// Page product scope — an unmatched combination stays selectable.
		return array(
			'values'                    => (array) ( $context['variantValues'] ?? array() ),
			'variants'                  => $context['variants'] ?? array(),
			'product'                   => (array) ( $context['product'] ?? array() ),
			'missing_means_unavailable' => false,
		);
	}

	/**
	 * Is a variant option value sold out, constrained by earlier selected options.
	 *
	 * Shared by the page product and bundle component pickers. Mirrors the JS
	 * `isProductVariantOptionSoldOut` in product-page/index.js.
	 *
	 * @param int   $option_number            Which option (1, 2 or 3) the pill represents.
	 * @param mixed $option_value             The pill's option value.
	 * @param array $values                   Currently selected option values for this scope.
	 * @param array $variants                 Variant data (arrays or objects) for this scope.
	 * @param array $product                  Parent product data for unlimited-stock fallback.
	 * @param bool  $missing_means_unavailable When true, a combination with no matching
	 *                                         variant counts as unavailable (bundle scope).
	 * @return bool
	 */
	private static function isVariantOptionSoldOut( int $option_number, $option_value, array $values, array $variants, array $product, bool $missing_means_unavailable = false ): bool {
		$variants = array_map( fn( $v ) => (array) $v, array_values( (array) $variants ) );

		$items = array_filter(
			$variants,
			function ( $variant ) use ( $option_number, $option_value, $values ) {
				// Earlier options must match the current selection.
				for ( $i = 1; $i < $option_number; $i++ ) {
					$prev_key = "option_$i";
					if ( ( $variant[ $prev_key ] ?? null ) !== ( $values[ $prev_key ] ?? null ) ) {
						return false;
					}
				}
				return ( $variant[ "option_$option_number" ] ?? null ) === $option_value;
			}
		);

		// No variant matches this combination.
		if ( empty( $items ) ) {
			return $missing_means_unavailable;
		}

		return self::isVariantGroupSoldOut( $items, $product );
	}

	/**
	 * Whether every variant in a group is out of stock.
	 *
	 * @param array $items   Variant data (arrays or objects) for the group.
	 * @param array $product Parent product data for unlimited-stock fallback.
	 * @return bool True only when the group has variants and all are sold out.
	 */
	private static function isVariantGroupSoldOut( array $items, array $product ): bool {
		if ( empty( $items ) ) {
			return false;
		}

		$stocks = array_map( fn( $v ) => self::effectiveVariantStock( (array) $v, $product ), array_values( $items ) );
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

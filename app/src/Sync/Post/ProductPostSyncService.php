<?php

namespace SureCart\Sync\Post;

use SureCart\Models\Concerns\Facade;
use SureCart\Models\VariantOptionValue;

/**
 * This class syncs product records to WordPress posts.
 */
class ProductPostSyncService {
	use Facade;

	/**
	 * The product model.
	 *
	 * @var \SureCart\Models\Product
	 */
	protected $product;

	/**
	 * The post.
	 *
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * The post type.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * Should we sync this with collections?
	 *
	 * @var string
	 */
	protected $with_collections = false;

	/**
	 * Should we do it with collections?
	 *
	 * @param string $with_collections Whether to sync with collections.
	 *
	 * @return self
	 */
	public function withCollections( $with_collections = true ) {
		$this->with_collections = $with_collections;
		return $this;
	}

	/**
	 * Find the post from the model.
	 *
	 * @param string $model_id The model id.
	 *
	 * @return \WP_Post|\WP_Error|null
	 */
	protected function findByModelId( string $model_id ) {
		// if we don't have a model id, return null.
		if ( empty( $model_id ) ) {
			return null;
		}

		// query the post.
		$query = new \WP_Query(
			[
				'post_type'      => $this->post_type,
				'post_status'    => [ 'auto-draft', 'draft', 'publish', 'trash', 'sc_archived' ],
				'posts_per_page' => 1,
				'no_found_rows'  => true,
				'meta_query'     => [
					[
						'key'   => 'sc_id',
						'value' => $model_id, // query by model id.
					],
				],
			]
		);

		// handle error.
		if ( is_wp_error( $query ) ) {
			return $query;
		}

		// get the post.
		$post = $query->posts[0] ?? null;

		// return the post.
		return apply_filters( "surecart_get_{$this->post_type}_post", $post, $model_id, $this );
	}

	/**
	 * Sync the model with the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 * @param boolean                $with_collections Whether to sync with collections.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	protected function sync( \SureCart\Models\Model $model ) {
		$this->post = $this->findByModelId( $model->id );

		if ( is_wp_error( $this->post ) ) {
			return $this->post;
		}

		return empty( $this->post->ID ) ? $this->create( $model ) : $this->update( $model );
	}

	/**
	 * Get the schema map.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function getSchemaMap( \SureCart\Models\Model $model ) {
		$base_amount = ! empty( $model->prices->data[0]->amount ) ? $model->prices->data[0]->amount : 0;
		return [
			'post_title'        => $model->name,
			'post_type'         => $this->post_type,
			'post_name'         => $model->slug,
			'menu_order'        => $model->position ?? 0,
			'sticky'            => $model->featured,
			'post_date'         => ( new \DateTime( "@$model->created_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
			'post_date_gmt'     => date_i18n( 'Y-m-d H:i:s', $model->created_at, true ),
			'post_modified'     => ( new \DateTime( "@$model->updated_at" ) )->setTimezone( new \DateTimeZone( wp_timezone_string() ) )->format( 'Y-m-d H:i:s' ),
			'post_modified_gmt' => date_i18n( 'Y-m-d H:i:s', $model->updated_at, true ),
			'post_status'       => $this->getPostStatusFromModel( $model ),
			'page_template'     => $this->convertTemplateId( $model->template_id ),
			'meta_input'        => [
				'sc_id'                        => $model->id,
				'product'                      => $model,
				'min_price_amount'             => ! empty( $model->metrics->min_price_amount ) ? $model->metrics->min_price_amount : $base_amount,
				'max_price_amount'             => ! empty( $model->metrics->max_price_amount ) ? $model->metrics->max_price_amount : $base_amount,
				'available_stock'              => $model->available_stock,
				'stock_enabled'                => $model->stock_enabled,
				'allow_out_of_stock_purchases' => $model->allow_out_of_stock_purchases,
				'featured'                     => $model->featured,
				'recurring'                    => $model->recurring,
				'shipping_enabled'             => $model->shipping_enabled,
			],
		];
	}

	/**
	 * Convert the template id.
	 *
	 * This removes the template theme prefix since this is not needed.
	 *
	 * @param string $id The template id.
	 *
	 * @return string
	 */
	protected function convertTemplateId( $id ) {
		$parts = explode( '//', $id, 2 );

		// not a FSE template.
		if ( count( $parts ) < 2 ) {
			return null;
		}
		return $parts[1] ?? null;
	}

	/**
	 * Create the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	protected function create( \SureCart\Models\Model $model ) {
		// don't do these actions as they can slow down the sync.
		foreach ( [ 'do_pings', 'transition_post_status', 'save_post', 'pre_post_update', 'add_attachment', 'edit_attachment', 'edit_post', 'post_updated', 'wp_insert_post', 'save_post_' . $this->post_type ] as $action ) {
			remove_all_actions( $action );
		}

		// we are importing.
		if ( ! defined( 'WP_IMPORTING' ) ) {
			define( 'WP_IMPORTING', true );
		}

		// insert post.
		$props   = $this->getSchemaMap( $model );
		$post_id = wp_insert_post( wp_slash( $props ), true, false );

		// handle errors.
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// we need to do this because tax_input checks permissions for some ungodly reason.
		wp_set_post_terms( $post_id, \SureCart::account()->id, 'sc_account' );

		if ( ! empty( $this->with_collections ) ) {
			// set the terms.
			$term_slugs = array_map( fn( $term ) => $term->name, $model->product_collections->data ?? [] );
			wp_set_post_terms( $post_id, $term_slugs, 'sc_collection' );
		}

		// delete existing.
		VariantOptionValue::where( 'product_id', $model->id )->delete();

		// create new.
		foreach ( $model->variant_options->data as $option ) {
			foreach ( $option->values as $value ) {
				$created = VariantOptionValue::create(
					[
						'value'      => $value,
						'name'       => $option->name,
						'post_id'    => $post_id,
						'product_id' => $model->id,
					]
				);
				if ( is_wp_error( $created ) ) {
					return $created;
				}
			}
		}

		// set the post on the model.
		$this->post = get_post( $post_id );

		return $this->post;
	}

	/**
	 * Update the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	protected function update( $model ) {
		// find the post.
		if ( empty( $this->post ) ) {
			$this->post = $this->findByModelId( $model->id );
		}

		$props = $this->getSchemaMap( $model );

		// if we already have a post template, don't sync. This is to prevent overwriting the template.
		if ( ! empty( $this->post->page_template ) ) {
			unset( $props['page_template'] );
		}

		// update the post by id.
		$post_id = wp_update_post(
			array_merge(
				$props,
				[
					'ID' => $this->post->ID,
				]
			)
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// set the collection terms.
		if ( ! empty( $this->with_collections ) ) {
			$term_slugs = array_map( fn( $term ) => $term->name, $model->product_collections->data ?? [] );
			wp_set_post_terms( $post_id, $term_slugs, 'sc_collection' );
		}

		$this->post = get_post( $post_id );

		return $this->post;
	}

	/**
	 * Add archived to the post meta.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return string
	 */
	protected function getPostStatusFromModel( \SureCart\Models\Model $model ) {
		// if it's archived, use that.
		if ( $model->archived ) {
			return 'sc_archived';
		}

		// if it's draft, use that.
		if ( 'draft' === ( $model->status ?? '' ) ) {
			return 'draft';
		}

		// default to publish.
		return 'publish';
	}
}

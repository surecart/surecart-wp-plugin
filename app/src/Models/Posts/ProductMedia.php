<?php
namespace SureCart\Models\Posts;

/**
 * Handles the price post type.
 */
class ProductMedia extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'attachment';

	/**
	 * The model
	 *
	 * @var \SureCart\Models\Model
	 */
	protected $model = \SureCart\Models\ProductMedia::class;

	/**
	 * The parent.
	 *
	 * @var \SureCart\Models\Posts\PostModel
	 */
	protected $parent = Product::class;

	/**
	 * Create the attachment.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function create( \SureCart\Models\Model $model ) {
		// TODO: check _source_url for attachment to see if it already exists.
		$url = ! empty( $model->media->url ) ? $model->media->url . '?/.' . $model->media->extension : $model->url;

		if ( empty( $url ) ) {
			error_log( 'no url found' );
			return false;
		}

		$attachment = wp_insert_attachment(
			[
				'post_title'     => $model->title,
				'post_status'    => 'inherit',
				'post_mime_type' => $model->media->mime_type ?? 'image/jpeg',
				'guid'           => $url,
			],
		);

		error_log( 'attachment: ' . print_r( $attachment, true ) );
		return $this;

		error_log( 'creating attachment: ' . $url );

		// add the attachment to the media library.
		$attachment_id = media_sideload_image( $url, 0, $model->title, 'id' );

		// sideload failed, we need some sort of fallback.
		if ( is_wp_error( $attachment_id ) ) {
			error_log( $attachment_id->get_error_message() );
			// TODO: fallback for if the image fails to download.
			error_log( 'failed to upload' );
			return $this;
		}

		error_log( 'attachment id: ' . $attachment_id );

		return $this;

		// get the product.
		$product_post = new Product( $model->product );
		// if we have an error, bail.
		if ( is_wp_error( $product_post ) ) {
			error_log( $product_post->get_error_message() );
			return $this;
		}
		// Check for the post ID..
		if ( empty( $product_post->ID ) ) {
			error_log( 'no product found' );
			return $this;
		}

		// set the featured image if this is the first image.
		if ( 0 === $model->position ) {
			// set the featured image.
			set_post_thumbnail( $product_post->ID, $attachment_id );
		}

		// update gallery ids.
		$existing = get_post_meta( $model->product, 'gallery', true );
		$updated  = array_unique( array_filter( array_merge( $existing, [ $attachment_id ] ) ) );
		error_log( 'updating gallery: ' . print_r( $updated, true ) );
		update_post_meta( $model->product, 'gallery', $updated );

		return $this;
	}
}

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
	 * Sync the model with the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function sync( \SureCart\Models\Model $model ) {
		$result = $this->findOrCreate( $model );

		if ( is_wp_error( $result ) ) {
			error_log( $result->get_error_message() );
			return $result;
		}

		if ( ! empty( $result ) ) {
			$this->post = $result->post;
		}

		// get the product post type.
		$product_post = new Product( $model->product );
		// set the featured image if this is the first image.
		if ( 0 === $model->position ) {
			// set the featured image .
			set_post_thumbnail( $product_post->ID, $this->post->ID );
		}

		// update the gallery.
		$existing = get_post_meta( $product_post->ID, 'gallery', true );
		$updated  = array_values( array_unique( array_filter( array_merge( (array) $existing, [ $this->post->ID ] ) ) ) );
		update_post_meta( $product_post->ID, 'gallery', $updated );
	}

	/**
	 * Get the url.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return string
	 */
	public function getUrl( \SureCart\Models\Model $model ) {
		return ! empty( $model->media->url ) ? $model->media->url . '?/' . $model->media->title . '.' . $model->media->extension : $model->url;
	}

	/**
	 * Create the attachment.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return int|\WP_Error
	 */
	public function findOrCreate( \SureCart\Models\Model $model ) {
		$product    = ! empty( $model->product ) && is_string( $model->product ) ? new Product( $model->product ) : null;
		$product_id = $product->ID ?? 0;

		// find by url and handle.
		$attachment = $this->findByUrl( $this->getUrl( $model ) );
		if ( is_wp_error( $attachment ) ) {
			return $attachment;
		}
		if ( ! empty( $attachment ) ) {
			if ( ! empty( $product_id ) && ! empty( $attachment->ID ) ) {
				wp_update_post(
					array(
						'ID'          => $attachment->ID,
						'post_parent' => $product_id,
					),
					true
				);
			}
			$this->post = $attachment;
			return $this;
		}

		// upload from url and handle.
		// $attachment_id = $this->uploadFromUrl( $url, $title, $product_id );
		// if ( is_wp_error( $attachment_id ) ) {
		// return $attachment_id;
		// }
		// if ( ! empty( $attachment_id ) ) {
		// $this->post = get_post( $attachment_id );
		// return $this;
		// }

		// create with url reference and handle.
		$attachment_id = $this->createWithUrlReference( $model, $product_id );
		if ( is_wp_error( $attachment_id ) ) {
			return $attachment_id;
		}
		if ( ! empty( $attachment_id ) ) {
			$this->post = get_post( $attachment_id );
			return $this;
		}

		return $this;
	}

	/**
	 * Create the attachment.
	 *
	 * @param string $url The url.
	 * @param string $title The title.
	 * @param string $product_id The product id.
	 *
	 * @return int|\WP_Error
	 */
	public function uploadFromUrl( $url, $title, $product_id = 0 ) {
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		return \media_sideload_image( $url, $product_id, $title, 'id' );
	}

	/**
	 * Create the attachment.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 * @param string                 $product_id The product id.
	 *
	 * @return int|\WP_Error
	 */
	public function createWithUrlReference( \SureCart\Models\Model $model, $product_id = 0 ) {
		$url       = $this->getUrl( $model );
		$title     = $model->title ?? $model->media->title ?? '';
		$mime_type = $model->media->mime_type ?? null;
		$width     = $model->media->width ?? null;
		$height    = $model->media->height ?? null;

		// fetch the mime type if not provided.
		if ( empty( $mime_type ) && ! empty( $model->url ) ) {
			$response  = wp_remote_head( $model->url );
			$headers   = wp_remote_retrieve_headers( $response );
			$mime_type = $headers['content-type'];
		}

		$attachment_id = wp_insert_attachment(
			[
				'post_title'     => $title,
				'post_parent'    => $product_id,
				'post_status'    => 'inherit',
				'post_mime_type' => $mime_type,
			],
		);

		// handle error.
		if ( is_wp_error( $attachment_id ) ) {
			error_log( $attachment_id->get_error_message() );
			return $this;
		}

		wp_update_attachment_metadata(
			$attachment_id,
			[
				'file'   => false,
				'width'  => $width,
				'height' => $height,
			]
		);

		// Store the original attachment source in meta.
		add_post_meta( $attachment_id, '_source_url', $url );

		// return the attachment id.
		return $attachment_id;
	}

	/**
	 * Find the attachment by url.
	 *
	 * @param string $url The url.
	 *
	 * @return \WP_Post|false
	 */
	public function findByUrl( $url ) {
		$args = array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => 1,
			'meta_query'     => array(
				array(
					'key'     => '_source_url',
					'value'   => $url,
					'compare' => '=',
				),
			),
		);

		$attachments = get_posts( $args );

		return ! empty( $attachments ) ? $attachments[0] : false;
	}
}

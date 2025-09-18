<?php

namespace SureCart\Sync;

/**
 * Syncs the content for a given sync key.
 */
class ContentSyncService {
	/**
	 * The app.
	 *
	 * @var \SureCart\App
	 */
	protected $sync_key = 'surecart_content_sync_key';

    /**
     * Bootstrap the service.
     */
    public function bootstrap() {
        // set the content when the product is first synced.
        add_action( 'surecart/product/sync/created/props', [ $this, 'setContent' ] );
    }

    /**
     * Set the content.
     *
     * @param array $props The props.
     * @param \SureCart\Models\Model $model The model.
     */
    public function setContent( $props, $model ) {
        $content = get_transient( $model->metadata->$this->sync_key );
        
        if ( $content ) {
            return array_merge( $props, array( 'post_content' => $content ) );
        }

        return $props;
    }

    /**
     * Set the sync key.
     *
     * @param array $model_data The model data.
     *
     * @return \SureCart\Models\Model
     */
    public function maybeStageContentSync( $model_data = [] ) {
        // bail if no content
        if ( empty( $model_data['content'] ) ) {
			return $model_data;
		}

        // generate a unique uuid
        $sync_key = wp_generate_uuid4();

        // set the sync key in the metadata
        $model_data['metadata'][$this->sync_key] = $sync_key;

        // set a transient to sync the content later (max 30 minutes)
		set_transient( $sync_key, $model_data['content'], 30 * MINUTE_IN_SECONDS );

        // return the model data
        return $model_data;
    }
}
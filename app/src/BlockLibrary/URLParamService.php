<?php

namespace SureCart\BlockLibrary;

/**
 * Provide URL params related functionality.
 */
class URLParamService {
    /**
     * Pagination Key.
     * 
     * @var string
     */
    public $pagination_key = 'page';

    /**
     * Get a unique key for a block.
     *  
     * @param  string $unique_id Unique ID.
     * @param  string $prefix Prefix.
     * @param  string $suffix Suffix.
     * @return string
     */
    public function getKey( $unique_id = '', $prefix = '', $suffix = '' ) {
        return trim( $prefix . '-' . $unique_id . '-' . $suffix, '-' );
    }

    /**
     * Add a filter argument to the URL.
     * 
     * @param  string $key Key.
     * @param  string $value Value.
     * @return string
     */
    public function addFilterArg( $key, $value ) {
        $existing_filters = $_GET[ $key ] ?? [];
        $filters = array_unique( array_merge( $existing_filters, [ $value ] ) );
        return remove_query_arg( $this->pagination_key, add_query_arg( $key, $filters ) );
    }
}

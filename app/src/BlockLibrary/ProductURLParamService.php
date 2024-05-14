<?php

namespace SureCart\BlockLibrary;

/**
 * Provide URL params related functionality.
 */
class ProductURLParamService {

    /**
     * Prefix.
     * 
     * @var string
     */
    protected $prefix = 'products';
	
    /**
     * Get a unique key for a block.
     *  
     * @param  string $unique_id Unique ID.
     * @param  string $prefix Prefix.
     * @param  string $suffix Suffix.
     * @return string
     */
    public function getKey( $key, $block_id ) {
        return \SureCart::block()->urlParams()->getKey( $block_id, $this->prefix, $key );
    }

    /**
     * Add a filter argument to the URL.
     * 
     * @param  string $key Key.
     * @param  string $value Value.
     * @return string
     */
    public function addFilterArg( $key, $value, $block_id ) {
       $key = $this->getKey( $key, $block_id );
       error_log( 'key: ' . $key );
       return \SureCart::block()->urlParams()->addFilterArg( $key, $value );
    }
}

<?php

namespace SureCart\BlockLibrary;

/**
 * Provide URL params related functionality.
 */
class URLParamService {
	 /**
     * Prefix.
     *
     * @var string
     */
    protected $prefix = 'query';

    /**
     * Pagination Key.
     *
     * @var string
     */
    public $pagination_key = 'page';

	/**
	 * Unique instance ID.
	 *
	 * @var string
	 */
	public $instance_id = '';

	/**
	 * Set the prefix.
	 *
	 * @param string $prefix
	 */
	public function __construct( $prefix = 'query' ) {
		$this->prefix = $prefix;
	}

	/**
	 * Set the block ID.
	 *
	 * @param string $prefix
	 */
	public function setPrefix( $prefix ) {
		$this->prefix = $prefix;
		return $this;
	}

	/**
	 * Set the block ID.
	 *
	 * @param string $instance_id
	 */
	public function setInstanceId( $instance_id ) {
		$this->instance_id = $instance_id;
		return $this;
	}

    /**
     * Get a unique key for a block.
	 *
	 * @param  string $name Name.
	 * @param  string $instance_id Unique instance ID.
	 *
     * @return string
     */
    public function getKey( $name = '', $instance_id = '' ) {
		$instance_id = $instance_id ?: $this->instance_id;
        return trim( $this->prefix . '-' . $instance_id . '-' . $name, '-' );
    }


	/**
	 * Get the filter arguments.
	 *
	 * @param  string $name Name.
	 * @param  string $instance_id Unique instance ID.
	 *
	 * @return array
	 */
	public function getArg( $name, $instance_id = '' ) {
		$instance_id = $instance_id ?: $this->instance_id;
		$key = $this->getKey($name, $instance_id);
		return $_GET[ $key ] ?? null;
	}

	/**
	 * Get the current page.
	 *
	 * @param  string $instance_id Unique instance ID.
	 *
	 * @return int
	 */
	public function getCurrentPage( $instance_id = '' ) {
		$instance_id = $instance_id ?: $this->instance_id;
		$key = $this->getKey( $this->pagination_key, $instance_id);
		return max( 1, absint( $_GET[ $key ] ?? 1 ) );
	}

	/**
	 * Add a generic argument to the URL.
	 *
	 * @param  string $key Key.
	 * @param  string $value Value.
	 * @return string
	 */
	public function addArg( $key, $value, $instance_id = '' ) {
		// get the instance ID.
		$instance_id = $instance_id ?: $this->instance_id;
		// get the key for this filter argument.
		$key = $this->getKey( $key, $instance_id );
		// return the new URL without pagination for filtering.
		return add_query_arg( $key, $value );
	}

	/**
	 * Add a pagination argument to the URL.
	 *
	 * @param  int $page Page.
	 * @param  string $instance_id Unique instance ID.
	 *
	 * @return string
	 */
	public function addPageArg( $page, $instance_id = '' ) {
		return $this->addArg( $this->pagination_key, $page, $instance_id );
	}

    /**
     * Add a filter argument to the URL.
     *
     * @param  string $key Key.
     * @param  string $value Value.
     * @return string
     */
    public function addFilterArg( $key, $value, $instance_id = '' ) {
		// get the instance ID.
		$instance_id = $instance_id ?: $this->instance_id;

		// get the key for this filter argument.
		$key = $this->getKey( $key, $instance_id );

		// get the existing filters.
        $existing_filters = $_GET[ $key ] ?? [];

		// add the new filter.
        $filters = array_unique( array_merge( $existing_filters, [ $value ] ) );

		// return the new URL without pagination for filtering.
        return remove_query_arg( $this->pagination_key, add_query_arg( $key, $filters ) );
    }
}

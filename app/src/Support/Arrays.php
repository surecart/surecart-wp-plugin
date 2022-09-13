<?php

namespace SureCart\Support;

/**
 * Array support.
 */
class Arrays {
	/**
	 * Flatten an array
	 *
	 * @param array $array Array.
	 *
	 * @return array
	 */
	public static function flatten( array $array ) {
		$return = array();
		array_walk_recursive(
			$array,
			function( $a ) use ( &$return ) {
				$return[] = $a;
			}
		);
		return $return;
	}
}

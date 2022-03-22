<?php

namespace SureCart\Support;

/**
 * Datetime utilities.
 */
class TimeDate {
	/**
	 * Get the SureCart date format
	 *
	 * @return string
	 */
	public static function getDateFormat() {
		$date_format = get_option( 'date_format' );
		if ( empty( $date_format ) ) {
			// Return default date format if the option is empty.
			$date_format = 'F j, Y';
		}
		return apply_filters( 'surecart/date_format', $date_format );
	}

	/**
	 * Get the SureCart time format
	 *
	 * @return string
	 */
	public static function getTimeFormat() {
		$time_format = get_option( 'time_format' );
		if ( empty( $time_format ) ) {
			// Return default time format if the option is empty.
			$time_format = 'g:i a';
		}
		return apply_filters( 'surecart/time_format', $time_format );
	}

	/**
	 *  Date Format - Allows to change date format for everything SureCart
	 *
	 * @return string
	 */
	public static function formatDate( $timestamp ) {
		return date_i18n( self::getDateFormat(), $timestamp );
	}

	/**
	 * WooCommerce Time Format - Allows to change time format for everything WooCommerce.
	 *
	 * @return string
	 */
	public static function formatTime( $timestamp ) {
		return date_i18n( self::getTimeFormat(), $timestamp );
	}

	/**
	 * Format both date and time
	 *
	 * @param integer $timestamp
	 * @return string
	 */
	public static function formatDateAndTime( $timestamp ) {
		return self::formatDate( $timestamp ) . ' ' . self::formatTime( $timestamp );
	}

	/**
	 * Human readable Human Time Diff
	 *
	 * @param integer $timestamp Timestamp
	 * @return string
	 */
	public static function humanTimeDiff( $timestamp, $ignore_after = '1 day' ) {
		if ( $timestamp > strtotime( "-$ignore_after", time() ) ) {
			return sprintf(
			/* translators: %s: human-readable time difference */
				_x( '%s ago', '%s = human-readable time difference', 'surecart' ),
				human_time_diff( $timestamp, time() )
			);
		} else {
			return self::formatDate( $timestamp );
		}
	}
}

<?php
namespace SureCart\Integrations\ThriveAutomator\Fields;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Silence is golden!
}

use Thrive\Automator\Items\Data_Field;

/** Product data field. */
class ProductDataField extends Data_Field {
	public static function get_id() {
		return 'surecart/product';
	}

	public static function get_supported_filters() {
		return [ 'autocomplete' ];
	}

	public static function get_name() {
		return 'Product';
	}

	public static function get_description() {
		return 'Target a specific product or products';
	}

	public static function get_placeholder() {
		return '';
	}

	public static function is_ajax_field() {
		return true;
	}

	public static function get_options_callback() {
		$posts = [];
		foreach (
			get_posts(
				[
					'posts_per_page' => '-1',
					'comment_status' => 'open',
					'post_type'      => get_post_types( '', 'names' ),
				]
			) as $post
		) {
			$posts[ $post->ID ] = [
				'label' => $post->post_title,
				'id'    => $post->ID,
			];
		}

		return $posts;
	}

	public static function get_field_value_type() {
		return static::TYPE_STRING;
	}

	public static function get_dummy_value() {
		return '22';
	}
}

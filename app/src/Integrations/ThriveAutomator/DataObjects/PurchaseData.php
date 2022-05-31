<?php

namespace SureCart\Integrations\ThriveAutomator\DataObjects;

use SureCart\Integrations\ThriveAutomator\Fields\ProductDataField;
use Thrive\Automator\Items\Data_Object;
use Thrive\Automator\Items\Firstname_Data_Field;
use Thrive\Automator\Items\Last_Login_Data_Field;
use Thrive\Automator\Items\Lastname_Data_Field;
use Thrive\Automator\Items\User_Email_Data_Field;
use Thrive\Automator\Items\User_Id_Data_Field;
use Thrive\Automator\Items\User_Registered_Data_Field;
use Thrive\Automator\Items\User_Role_Data_Field;
use Thrive\Automator\Items\Username_Data_Field;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Purchase data
 */
class PurchaseData extends Data_Object {

	public static function get_id() {
		return 'surecart/purchase_data';
	}

	public static function get_nice_name() {
		return 'Purchase';
	}

	public static function get_fields() {
		return [
			ProductDataField::get_id(),
			User_Id_Data_Field::get_id(),
			Last_Login_Data_Field::get_id(),
			User_Registered_Data_Field::get_id(),
			Username_Data_Field::get_id(),
			User_Role_Data_Field::get_id(),
			User_Email_Data_Field::get_id(),
			Firstname_Data_Field::get_id(),
			Lastname_Data_Field::get_id(),
		];
	}

	public static function create_object( $param ) {
		$comment = null;

		if ( $comment ) {
			return [
				'comment_author'       => $comment->comment_author,
				'comment_author_email' => $comment->comment_author_email,
				'comment_author_url'   => $comment->comment_author_url,
				'comment_content'      => $comment->comment_content,
				'comment_date'         => $comment->comment_date,
				'comment_date_gmt'     => $comment->comment_date_gmt,
				'comment_type'         => $comment->comment_type,
				'comment_parent'       => $comment->comment_parent,
				'comment_post_ID'      => $comment->comment_post_ID,
				'user_id'              => $comment->user_id,
				'comment_agent'        => $comment->comment_agent,
				'comment_author_IP'    => $comment->comment_author_IP,
			];

		}

		return $comment;
	}

	public function can_provide_email() {
		return true;
	}

	public function get_provided_email() {
		return $this->get_value( 'comment_author_email' );
	}
}

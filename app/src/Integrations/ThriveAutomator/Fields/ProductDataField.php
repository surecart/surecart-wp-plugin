<?php

namespace SureCart\Integrations\ThriveAutomator\Fields;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Silence is golden!
}

use SureCart\Models\Product;
use Thrive\Automator\Items\Data_Field;

/**
 * Class ProductDataField
 */
class ProductDataField extends Data_Field {
    /**
     * Get the data field identifier
     *
     * @return string
     */
    public static function get_id() {
        return 'surecart_product';
    }

    /**
     * Get the data field name
     *
     * @return string
     */
    public static function get_name() {
        return 'SureCart Product';
    }

    /**
     * Get the data field description
     *
     * @return string
     */
    public static function get_description() {
        return 'Show all SureCart Products';
    }

    /**
     * Get the data field input placeholder
     *
     * @return string
     */
    public static function get_placeholder() {
        return 'Select SureCart Product';
    }

    /**
     * Get the data field supported filter
     *
     * @return array
     */
    public static function get_supported_filters() {
        return ['dropdown'];
    }

    /**
     * For multiple option inputs, name of the callback function called through ajax to get the options
     *
     * @return array
     */
    public static function get_options_callback() {
        $options = [];
        // $products = Product::get();
        $products = Product::where( [
            'archived' => false,
        ] )->get();
        foreach ( $products as $product ) {
            $options[$product->id] = [
                'label' => $product->name,
                'id'    => $product->id,
            ];
        }

        return $options;
    }

    /**
     * Determine if the values are direct or an ajax request
     *
     * @return boolean
     */
    public static function is_ajax_field() {
        return true;
    }

    /**
     * Get data field value type
     *
     * @return string
     */
    public static function get_field_value_type() {
        return static::TYPE_ARRAY;
    }

    /**
     * Get dummy value
     *
     * @return string
     */
    public static function get_dummy_value() {
        return 'subscriber';
    }

    /**
     * Get validators
     *
     * @return array
     */
    public static function get_validators() {
        return ['required'];
    }
}

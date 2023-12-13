<?php

namespace SureCart\Database\Tables;

use SureCart\Database\Table;

/**
 * The integrations table class.
 */
class Relationships {

	/**
	 * Holds the table instance.
	 *
	 * @var \SureCart\Database\Table
	 */
	protected $table;

	/**
	 * Version number for the table.
	 * Change this to update the table.
	 *
	 * @var integer
	 */
	protected $version = 1;

	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'surecart_relationships';

	/**
	 * Get the table dependency.
	 *
	 * @param \SureCart\Database\Table $table The table dependency.
	 */
	public function __construct( Table $table ) {
		$this->table = $table;
	}

	/**
	 * Get the table name.
	 *
	 * @return string
	 */
	public function getName() {
		global $wpdb;
		return $wpdb->prefix . $this->name;
	}

	/**
	 * Add relationships custom table
	 * This allows for simple, efficient queries
	 *
	 * @return mixed
	 */
	public function install() {
		return $this->table->create(
			$this->name,
			"
            `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			`from` bigint(20) unsigned NOT NULL,
			`to` bigint(20) unsigned NOT NULL,
			`type` varchar(44) NOT NULL default '',
			`order_from` bigint(20) unsigned NOT NULL,
			`order_to` bigint(20) unsigned NOT NULL,
			PRIMARY KEY  (`ID`),
			KEY `from` (`from`),
			KEY `to` (`to`),
			KEY `type` (`type`)
			",
			$this->version
		);
	}

	/**
	 * Uninstall tables
	 *
	 * @return boolean
	 */
	public function uninstall() {
		return $this->table->drop( $this->getName() );
	}

	/**
	 * Does the table exist?
	 *
	 * @return boolean
	 */
	public function exists() {
		return $this->table->exists( $this->name );
	}
}

<?php

namespace SureCart\Integrations\Contracts;

interface IntegrationInterface {
	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getSlug();

	/**
	 * Get the model for the integration.
	 *
	 * @return string
	 */
	public function getModel();

	/**
	 * Get the logo for the integration.
	 *
	 * @return string
	 */
	public function getLogo();

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getName();

	/**
	 * Get the item label for the integration.
	 *
	 * @return string
	 */
	public function getItemLabel();

	/**
	 * Get the item help label for the integration.
	 *
	 * @return string
	 */
	public function getItemHelp();

	/**
	 * Get item listing for the integration.
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items = [] );

	/**
	 * Get the individual item.
	 *
	 * @param string $item The item record.
	 * @param string $id Id for the record.
	 *
	 * @return array The item for the integration.
	 */
	public function getItem( $id );
}

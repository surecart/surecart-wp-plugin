<?php

namespace SureCart\Models;

/**
 * The integration listing model.
 */
class IntegrationCatalog extends StaticFileModel {
	/**
	 * The data file.
	 *
	 * @var string
	 */
	protected $directory = __DIR__ . '/../Integrations/Catalog';
}

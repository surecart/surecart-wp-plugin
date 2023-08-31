/**
 * Internal dependencies.
 */
import { registerBlocksForTemplates } from './conditional-block-registration';

import * as ProductCollectionTitle from '@blocks/ProductCollectionTitle';
import * as ProductCollectionDescription from '@blocks/ProductCollectionDescription';
import * as ProductCollection from '@blocks/ProductCollection';

registerBlocksForTemplates({
	blocks: [
		ProductCollectionTitle,
		ProductCollectionDescription,
		ProductCollection,
	],

	// include only for these templates.
	include: [
		'surecart/surecart//product-collection-part',
		'surecart/surecart//product-collection',
	],
});

/**
 * Internal dependencies.
 */
import { registerBlocksForTemplates } from './conditional-block-registration';

import * as ProductCollectionTitle from '@blocks/ProductCollectionTitle';
import * as ProductCollectionDescription from '@blocks/ProductCollectionDescription';

registerBlocksForTemplates({
	blocks: [ProductCollectionTitle, ProductCollectionDescription],

	// include only for these templates.
	include: [
		'surecart/surecart//product-collection-part',
		'surecart/surecart//product-collection',
	],
});

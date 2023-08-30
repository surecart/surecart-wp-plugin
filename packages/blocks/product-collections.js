/**
 * Internal dependencies.
 */
import { registerBlocksForTemplates } from './conditional-block-registration';

import * as ProductCollection from '@blocks/ProductCollection';

registerBlocksForTemplates({
	blocks: [ProductCollection],

	include: [
		'surecart/surecart//product-collection-part',
		'surecart/surecart//product-collection',
	],
});

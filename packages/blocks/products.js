import { registerBlocksExceptForTemplates } from './conditional-block-registration';

import * as ProductItem from '@blocks/ProductItem';
import * as ProductItemImage from '@blocks/ProductItemImage';
import * as ProductItemList from '@blocks/ProductItemList';
import * as ProductItemPrice from '@blocks/ProductItemPrice';
import * as ProductItemTitle from '@blocks/ProductItemTitle';

// unregister these blocks on product page templates.
// @todo Refactor when there will be possible to show a block according on a template/post with a Gutenberg API. https://github.com/WordPress/gutenberg/pull/41718
registerBlocksExceptForTemplates({
	blocks: [
		ProductItem,
		ProductItemImage,
		ProductItemList,
		ProductItemPrice,
		ProductItemTitle,
	],
	templates: [
		'surecart/surecart//product-info',
		'surecart/surecart//single-product',
		'sc-products',
		'sc-part-products-info',
	],
});

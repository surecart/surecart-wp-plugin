/**
 * Internal dependencies.
 */
import * as BuyButtons from './Blocks/Product/BuyButtons';
import * as BuyButton from './Blocks/Product/BuyButton';
import * as Description from './Blocks/Product/Description';
import * as Media from './Blocks/Product/Media';
import * as Price from './Blocks/Product/Price';
import * as Quantity from './Blocks/Product/Quantity';
import * as Title from './Blocks/Product/Title';
import * as PriceChoices from './Blocks/Product/PriceChoices';
import * as Variants from './Blocks/Product/VariantChoices';
import * as CollectionBadges from './Blocks/Product/CollectionBadges';
import { registerBlocksForTemplates } from './conditional-block-registration';
import { upsellPageTemplates } from './upsell';

const productPageBlocks = [BuyButtons, BuyButton, CollectionBadges];
const commonBlocks = [
	Quantity,
	Title,
	Media,
	Description,
	Price,
	PriceChoices,
	Variants,
];
const productPageTemplates = [
	'surecart/surecart//product-info',
	'surecart/surecart//single-product',
	'sc-products',
	'sc-part-products-info',
];

// Common blocks for templates.
registerBlocksForTemplates({
	blocks: commonBlocks,
	include: [...productPageTemplates, ...upsellPageTemplates],
});

// Product page specific blocks.
registerBlocksForTemplates({
	blocks: productPageBlocks,
	include: productPageTemplates,
});

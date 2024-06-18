/**
 * Internal dependencies.
 */
import * as BuyButtons from './Blocks/Product/BuyButtons';
import * as BuyButton from './Blocks/Product/BuyButton';
import * as Price from './Blocks/Product/Price';
import * as PriceChoices from './Blocks/Product/PriceChoices';
import * as Variants from './Blocks/Product/VariantChoices';
import * as CollectionBadges from './Blocks/Product/CollectionBadges';
import { registerBlocksForTemplates } from './conditional-block-registration';
import { upsellPageTemplates } from './upsell';

const productPageBlocks = [BuyButtons, BuyButton, CollectionBadges];
const commonBlocks = [Price, PriceChoices, Variants];
const productPageTemplates = [
	'surecart/surecart//product-info',
	'surecart/surecart//single-sc_product',
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

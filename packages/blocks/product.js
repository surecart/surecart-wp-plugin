/**
 * WordPress dependencies
 */
import { registerBlocks } from './register-block';

import './plugins/product-panel';

import * as productInfo from './Blocks/Product/Info';
import * as productCartButton from './Blocks/ProductCartButton';
import * as productForm from './Blocks/ProductForm';
import * as productQuantity from './Blocks/ProductQuantity';
import * as productTitle from './Blocks/ProductTitle';
import * as productPrices from './Blocks/ProductPrices';

registerBlocks([
	productInfo,
	productCartButton,
	productForm,
	productQuantity,
	productTitle,
	productPrices,
]);

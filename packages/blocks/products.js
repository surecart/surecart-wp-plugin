import { registerBlocks } from './register-block';

import * as ProductItem from '@blocks/ProductItem';
import * as ProductItemImage from '@blocks/ProductItemImage';
import * as ProductItemList from '@blocks/ProductItemList';
import * as ProductItemPrice from '@blocks/ProductItemPrice';
import * as ProductItemTitle from '@blocks/ProductItemTitle';
import * as ProductPrice from '@blocks/Product/Price';

registerBlocks([
	ProductItem,
	ProductItemImage,
	ProductItemPrice,
	ProductItemTitle,
	ProductItemList,
	ProductPrice,
]);

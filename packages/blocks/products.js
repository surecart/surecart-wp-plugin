import { registerBlocks } from './register-block';

import * as ProductItem from '@blocks/ProductItem';
import * as ProductItemButton from '@blocks/ProductItemButton';
import * as ProductItemImage from '@blocks/ProductItemImage';
import * as ProductItemList from '@blocks/ProductItemList';
import * as ProductItemPrice from '@blocks/ProductItemPrice';
import * as ProductItemTitle from '@blocks/ProductItemTitle';

registerBlocks([
	ProductItem,
	ProductItemButton,
	ProductItemImage,
	ProductItemList,
	ProductItemPrice,
	ProductItemTitle,
]);

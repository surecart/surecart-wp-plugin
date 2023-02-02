import * as BuyButtons from './Blocks/Product/BuyButtons';
import * as Description from './Blocks/Product/Description';
import * as Image from './Blocks/Product/Image';
import * as Info from './Blocks/Product/Info';
import * as Prices from './Blocks/Product/Price';
import * as Quantity from './Blocks/Product/Quantity';
import * as Title from './Blocks/Product/Title';
import { registerBlocks } from './register-block';

import './plugins/product-panel';

registerBlocks([Info, BuyButtons, Quantity, Title, Image, Description, Prices]);

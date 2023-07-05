// import * as BuyButtons from './Blocks/Product/BuyButtons';
import * as BuyButton from './Blocks/Product/BuyButton';
import * as Description from './Blocks/Product/Description';
import * as Media from './Blocks/Product/Media';
import * as Price from './Blocks/Product/Price';
import * as Quantity from './Blocks/Product/Quantity';
import * as Title from './Blocks/Product/Title';
import * as PriceChoices from './Blocks/Product/PriceChoices';
import * as Variants from './Blocks/Product/Variants';
import { registerBlocks } from './register-block';
import { __ } from '@wordpress/i18n';

registerBlocks([
	// BuyButtons,
	BuyButton,
	Quantity,
	Title,
	Media,
	Description,
	Price,
	PriceChoices,
	Variants
]);

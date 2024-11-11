import { registerBlocks } from './register-block';

import * as Price from './Blocks/Product/Price';
import * as PriceChoices from './Blocks/Product/PriceChoices';
import * as Variants from './Blocks/Product/VariantChoices';
import * as CollectionBadges from './Blocks/Product/CollectionBadges';

registerBlocks([CollectionBadges, Price, PriceChoices, Variants]);

/**
 * Internal dependencies.
 */
import { registerBlocks } from './register-block';

import * as ProductCollection from '@blocks/ProductCollection';
import * as ProductCollectionTitle from '@blocks/ProductCollectionTitle';
import * as ProductCollectionDescription from '@blocks/ProductCollectionDescription';

registerBlocks([
	ProductCollectionTitle,
	ProductCollectionDescription,
	ProductCollection,
]);

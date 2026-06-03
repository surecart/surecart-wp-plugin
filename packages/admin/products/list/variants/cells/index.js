import mediaCell from './media';
import createdAtCell from './created_at';
import nameCell from './name';
import priceCell from './price';
import skuCell from './sku';
import quantityCell from './quantity';

export default {
	media: mediaCell,
	created_at: createdAtCell,
	name: nameCell,
	display_name: nameCell,
	price: priceCell,
	sku: skuCell,
	quantity: quantityCell,
};

export { mediaCell, createdAtCell, nameCell, priceCell, skuCell, quantityCell };

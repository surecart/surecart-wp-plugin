import { createPrice, deleteAllPrices, getDefaultPriceData } from './prices';
export const API_PATH = '/surecart/v1/products';

export const getDefaultProductData = {
	name: 'Test Product',
};

/**
 * Create Product.
 *
 * @param {object} requestUtils
 * @param {object} data
 * @returns
 */
export const createProduct = async (
	requestUtils,
	data = getDefaultProductData(),
	priceData = getDefaultPriceData()
) => {
	// Create product.
	const product = await requestUtils.rest({
		method: 'POST',
		path: API_PATH,
		data,
	});

	// Create price.
	await createPrice(requestUtils, {
		...priceData,
		product_id: product.id,
	});

	return product;
};

/**
 * Delete all products.
 *
 * @param {object} requestUtils
 */
export const deleteAllProducts = async (requestUtils) => {
	// Delete all prices first.
	await deleteAllPrices(requestUtils);

	let products = [];
	try {
		products =
			(await requestUtils.rest({
				method: 'GET',
				path: API_PATH,
				query: {
					per_page: 100,
				},
			})) || [];
	} catch (error) {
		console.error(error);
	}

	// Delete all one by one.
	try {
		const deletePromises = products.map(async (product) => {
			console.log(`Product - ${product.id} - Deleting...`);
			try {
				await requestUtils.rest({
					method: 'DELETE',
					path: `${API_PATH}/${product.id}`,
				});
				console.log(`Product - ${product.id} - Deleted.`);
			} catch (error) {
				// Handle the specific error need to ignore, cause the tests are executing parallelly.
				if (error.code === 'product.not_found') {
					console.log(
						`Product - ${product.id} - Not found, skipping.`
					);
					// You can return a default value or null here if you don't want to propagate the error
					return null;
				} else {
					// If it's a different error, you can re-throw it or handle it as needed
					throw error;
				}
			}
		});

		// Wait for all deletePromises to complete
		await Promise.all(deletePromises);
	} catch (error) {
		console.error(error);
	}
};

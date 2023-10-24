const API_PATH = '/surecart/v1/prices';

/**
 * Get default price data.
 *
 * @returns object
 */
export const getDefaultPriceData = () => {
	return {
		amount: '1000.00',
		currency: 'usd',
	};
};

/**
 * Create Price.
 *
 * @param {object} requestUtils
 * @param {object} data
 * @returns {object} product
 */
export const createPrice = async (requestUtils, data) => {
	return await requestUtils.rest({
		method: 'POST',
		path: API_PATH,
		data,
	});
};

/**
 * Delete all prices.
 *
 * @param {object} requestUtils
 */
export const deleteAllPrices = async (requestUtils) => {
	let prices = [];
	try {
		prices =
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
		const deletePromises = prices.map(async (price) => {
			console.log(`Price - ${price.id} - Deleting...`);
			try {
				await requestUtils.rest({
					method: 'DELETE',
					path: `${API_PATH}/${price.id}`,
				});
				console.log(`Price - ${price.id} - Deleted.`);
			} catch (error) {
				// Handle the specific error need to ignore, cause the tests are executing parallelly.
				if (error.code === 'price.not_found') {
					console.log(`Price - ${price.id} - Not found, skipping.`);
					return null;
				} else {
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

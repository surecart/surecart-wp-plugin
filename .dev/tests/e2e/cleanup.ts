const RESOURCES = [
	'/surecart/v1/products',
	'/surecart/v1/prices',
	'/surecart/v1/coupons',
	'/surecart/v1/product_collections',
];

export default (requestUtils) => {
	return RESOURCES.forEach(async (path) => {
		const models = await requestUtils.rest({
			path,
			params: {
				per_page: 100,
			},
		});

		// Delete all one by one.
		await Promise.all(
			models.map((model) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `${path}/${model.id}`,
				})
			)
		);
	});
}

export const createProvisionalAccount = async (requestUtils) => {
	try {
		const provisionalStore = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/provisional_accounts',
			data: {
				email : 'manirujjamanakash@gmail.com',
			}
		});

		if (!provisionalStore?.id) {
			throw new Error('Provisional account could not be created.');
		}

		return provisionalStore;
	} catch (error) {
		console.log('Error::createProvisionalAccount()-->', error);
	}
}
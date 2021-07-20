const { apiFetch } = wp;

export default {
	FETCH_FROM_API( action ) {
		return apiFetch( {
			path: 'wp/v2/settings',
		} );
	},
};

const { apiFetch } = wp;

export default {
	FETCH_FROM_API( action ) {
		return apiFetch( {
			path: `checkout-engine/v1/${ action.path }`,
		} );
	},
};

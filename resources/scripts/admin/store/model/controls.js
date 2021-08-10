const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

export default {
	FETCH_FROM_API( action ) {
		return apiFetch( {
			path: addQueryArgs(
				`checkout-engine/v1/${ action.path }`,
				action?.query
			),
		} );
	},
};

const { apiFetch } = wp;

export default {
	FETCH_FROM_API(action) {
		return apiFetch({
			path: `surecart/v1/${action.path}`,
		});
	},
};

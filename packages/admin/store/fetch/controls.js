const { apiFetch } = wp;
const { addQueryArgs } = wp.url;

export const fetch = (options = {}) => {
	return {
		type: 'FETCH_FROM_API',
		options,
	};
};

export default {
	FETCH_FROM_API({ options }) {
		const { path, query } = options;
		return apiFetch({
			...(options || {}),
			path: addQueryArgs(`surecart/v1/${path}`, query),
		});
	},
};

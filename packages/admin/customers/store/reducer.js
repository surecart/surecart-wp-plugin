// this store is a proxy for the core/data store.
export default (
	state = {
		connect: null,
		disconnect: null,
	},
	{ type, payload }
) => {
	switch (type) {
		case 'SET_USER':
			return {
				...state,
				connect: payload,
			};
		case 'DISCONNECT_USER':
			return {
				...state,
				disconnect: payload,
			};
	}
};

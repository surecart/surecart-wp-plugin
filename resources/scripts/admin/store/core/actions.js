export function* saveModel( endpoint, data, type ) {
	let response;

	try {
		response = yield apiFetch( {
			path: data.id ? `${ endpoint }/${ data.id }` : endpoint,
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( coupon ) {
		return { type, coupon };
	}

	// didn't update.
	return {
		type: 'SAVE_ERROR',
		message: 'Failed to update coupon.',
	};
}

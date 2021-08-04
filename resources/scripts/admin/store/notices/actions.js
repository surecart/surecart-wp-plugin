export function addNotice( notice ) {
	return {
		type: 'ADD_NOTICE',
		notice,
	};
}

export function removeNotice( id ) {
	return {
		type: 'REMOVE_NOTICE',
		id,
	};
}

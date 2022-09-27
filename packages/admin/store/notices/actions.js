export function addSnackbarNotice(notice) {
	return {
		type: 'ADD_SNACKBAR_NOTICE',
		notice,
	};
}

export function removeSnackbarNotice(id) {
	return {
		type: 'REMOVE_SNACKBAR_NOTICE',
		id,
	};
}

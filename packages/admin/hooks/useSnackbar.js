const { useSelect, useDispatch } = wp.data;
import { store } from '../store/ui';

export default function useSnackbar() {
	const { addSnackbarNotice, removeSnackbarNotice } = useDispatch(store);
	const snackbarNotices = useSelect((select) =>
		select(store).snackbarNotices()
	);

	return {
		addSnackbarNotice,
		removeSnackbarNotice,
		snackbarNotices,
	};
}

window.ce = window.ce || {};
window.ce.useSnackbar = useSnackbar;

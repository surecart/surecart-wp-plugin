const { useSelect, useDispatch } = wp.data;
import { STORE_KEY } from '../store/notices';

export default function useSnackbar() {
	const { addSnackbarNotice, removeSnackbarNotice } = useDispatch(
		STORE_KEY
	);
	const snackbarNotices = useSelect( ( select ) =>
		select( STORE_KEY ).snackbarNotices()
	);

	return {
		addSnackbarNotice,
		removeSnackbarNotice,
		snackbarNotices,
	};
}

window.ce = window.ce || {};
window.ce.useSnackbar = useSnackbar;

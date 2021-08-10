const { useSelect, dispatch } = wp.data;

export default function useSnackbar() {
	return useSelect( ( select ) => {
		const { snackbarNotices } = select( 'checkout-engine/notices' );
		const { addSnackbarNotice, removeSnackbarNotice } = dispatch(
			'checkout-engine/notices'
		);
		return {
			snackbarNotices: snackbarNotices(),
			addSnackbarNotice,
			removeSnackbarNotice,
		};
	} );
}

window.ce = window.ce || {};
window.ce.useSnackbar = useSnackbar;

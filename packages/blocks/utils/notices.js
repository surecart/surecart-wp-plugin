import { dispatch } from '@wordpress/data';
export function snackbarNotice( { status = 'success', message } ) {
	dispatch( 'core/notices' ).createNotice(
		status, // Can be one of: success, info, warning, error.
		message, // Text string to display.
		{ type: 'snackbar' }
	);
}

export function notice( { status = 'success', message } ) {
	dispatch( 'core/notices' ).createNotice(
		status, // Can be one of: success, info, warning, error.
		message // Text string to display.
	);
}

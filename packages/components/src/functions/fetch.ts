import apiFetch from '@wordpress/api-fetch';

export default window?.wp?.apiFetch ? window.wp.apiFetch : apiFetch;

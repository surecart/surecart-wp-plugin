/**
 * External dependencies
 */
import { createBrowserHistory } from 'history';

/**
 * WordPress dependencies
 */
import { buildQueryString } from '@wordpress/url';

const history = createBrowserHistory();

const originalHistoryPush = history.push;
const originalHistoryReplace = history.replace;

function push(params, state) {
	const search = buildQueryString(params);
	return originalHistoryPush.call(history, { search }, state);
}

function replace(params, state) {
	const search = buildQueryString(params);
	return originalHistoryReplace.call(history, { search }, state);
}

const locationMemo = new WeakMap();
function getLocationWithParams() {
	const location = history.location;
	let locationWithParams = locationMemo.get(location);
	if (!locationWithParams) {
		locationWithParams = {
			...location,
			params: Object.fromEntries(new URLSearchParams(location.search)),
		};
		locationMemo.set(location, locationWithParams);
	}
	return locationWithParams;
}

history.push = push;
history.replace = replace;
history.getLocationWithParams = getLocationWithParams;

export default history;

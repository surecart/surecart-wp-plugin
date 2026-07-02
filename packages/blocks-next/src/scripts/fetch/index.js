const apiFetch = wp.apiFetch;
const { addQueryArgs, getQueryArg } = wp.url;

const rootURL =
	window?.parent?.scFetchData?.root_url || window?.scFetchData?.root_url;

// scFetchData is only printed on wp_footer (frontend). In contexts where it is
// absent (e.g. the editor, when another plugin enqueues this view module there),
// rootURL is undefined and registering middleware would poison the global apiFetch.
if (rootURL) {
	apiFetch.fetchAllMiddleware = null;

	apiFetch.use(apiFetch.createRootURLMiddleware(rootURL));

	if (window?.scFetchData?.nonce) {
		// @ts-ignore
		apiFetch.nonceMiddleware = apiFetch.createNonceMiddleware(
			window?.scFetchData?.nonce
		);
		// @ts-ignore
		apiFetch.use(apiFetch.nonceMiddleware);
	}

	if (window?.scFetchData?.nonce_endpoint) {
		// @ts-ignore
		apiFetch.nonceEndpoint = window?.scFetchData?.nonce_endpoint;
	}

	// Add a timestamp so it can bypass cache rest api
	apiFetch.use((options, next) => {
		options.path = addQueryArgs(options.path, { t: Date.now() });
		return next(options);
	});

	// Add selected currency to the request
	apiFetch.use((options, next) => {
		options.path = addQueryArgs(options.path, {
			...(!!getQueryArg(window.location.href, 'currency') && {
				currency: getQueryArg(window.location.href, 'currency'),
			}),
		});
		return next(options);
	});
}

export default apiFetch;

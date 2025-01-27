const apiFetch = wp.apiFetch;
const { addQueryArgs, getQueryArg } = wp.url;

apiFetch.fetchAllMiddleware = null;

apiFetch.use(
	apiFetch.createRootURLMiddleware(
		window?.parent?.scFetchData?.root_url || window?.scFetchData?.root_url
	)
);

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
		...(window?.scFetchData?.convert_currency && {
			convert_currency: true,
		}),
	});
	return next(options);
});

export default apiFetch;

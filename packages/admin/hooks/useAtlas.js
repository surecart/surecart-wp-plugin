/**
 * Atlas API hooks and utilities for fetching country and region data.
 */
import { useState, useEffect } from '@wordpress/element';

const ATLAS_API_BASE = 'https://api.surecart.com/v1/public/atlas';

let countriesPromiseCache = null;

/**
 * Get the current locale.
 *
 * @return {string} The locale code.
 */
function getLocale() {
	return window?.scData?.locale || 'en';
}

/**
 * Fetch and cache the countries list. Concurrent callers share the same
 * in-flight request; subsequent callers get the already-resolved promise.
 *
 * @return {Promise<Array>} The countries array.
 */
function fetchCountries() {
	if (countriesPromiseCache) return countriesPromiseCache;

	countriesPromiseCache = fetch(`${ATLAS_API_BASE}?locale=${getLocale()}`)
		.then((res) => res.json())
		.then((data) => data?.data || [])
		.catch((err) => {
			countriesPromiseCache = null;
			throw err;
		});

	return countriesPromiseCache;
}

/**
 * Fetch country details from the Atlas API.
 * Exported for components that need custom batching logic.
 *
 * @param {string} countryCode The ISO country code.
 * @return {Promise<Object>} Country details including states.
 */
export async function fetchCountryDetails(countryCode) {
	const response = await fetch(
		`${ATLAS_API_BASE}/${countryCode}?locale=${getLocale()}`
	);
	return response.json();
}

/**
 * Hook to fetch all countries.
 *
 * @return {{countries: Array, loading: boolean, error: Error|null}} Countries data and state.
 */
export function useCountries() {
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchCountries()
			.then(setCountries)
			.catch(setError)
			.finally(() => setLoading(false));
	}, []);

	return { countries, loading, error };
}

/**
 * Hook to fetch country details including states/regions.
 *
 * @param {string} countryCode The ISO country code.
 * @param {Object} options Options object.
 * @param {boolean} options.enabled Whether to fetch (default: true).
 * @return {{details: Object|null, loading: boolean, error: Error|null}} Country details and state.
 */
export function useCountryDetails(countryCode, { enabled = true } = {}) {
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!enabled || !countryCode) return;

		setLoading(true);
		fetch(`${ATLAS_API_BASE}/${countryCode}?locale=${getLocale()}`)
			.then((res) => res.json())
			.then(setDetails)
			.catch(setError)
			.finally(() => setLoading(false));
	}, [countryCode, enabled]);

	return { details, loading, error };
}

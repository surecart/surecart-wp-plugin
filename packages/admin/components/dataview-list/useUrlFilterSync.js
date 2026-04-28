/**
 * Generic URL ↔ DataViews filter serialiser.
 *
 * Each registered filter declares its own `urlKey`, plus optional
 * `serialize` / `deserialize` (or `multiple: true` to default to comma-joined
 * arrays). The hook reads `window.location` once on mount to seed the
 * initial filters, then watches `view.filters` and writes them back to the
 * URL via the SureCart router — defaults are stripped so the URL stays
 * minimal.
 *
 * Two entry points so screens can call `readInitialFiltersFromUrl` *before*
 * setting up `useDataViewState`, then call `useUrlFilterWriter` *after* it.
 */
import { useEffect, useMemo, useRef } from 'react';
import { getQueryArgs } from '@wordpress/url';
import { useHistory } from '../../router';

const defaultSerialize = (value, multiple) => {
	if (value === null || value === undefined) return undefined;
	if (multiple) {
		const arr = Array.isArray(value) ? value : [value];
		const cleaned = arr.filter(
			(v) => v !== null && v !== undefined && v !== ''
		);
		return cleaned.length ? cleaned.join(',') : undefined;
	}
	return value === '' ? undefined : String(value);
};

const defaultDeserialize = (raw, multiple) => {
	if (raw === undefined || raw === null || raw === '') return undefined;
	if (multiple) return String(raw).split(',').filter(Boolean);
	return raw;
};

/**
 * Read URL params synchronously and return DataViews filter shapes. Use this
 * when seeding `initialViewFilters` for `useDataViewState`.
 */
export const readInitialFiltersFromUrl = (filters) => {
	const params = getQueryArgs(window.location.href);
	const out = [];
	for (const cfg of filters) {
		const raw = params[cfg.urlKey];
		const deserialize = cfg.deserialize || defaultDeserialize;
		const value = deserialize(raw, !!cfg.multiple);
		if (value === undefined) continue;
		out.push({
			field: cfg.field,
			operator: cfg.operator || (cfg.multiple ? 'isAny' : 'is'),
			value,
		});
	}
	return out;
};

/**
 * Effect-only writer that mirrors the live `view.filters` to the URL.
 *
 * @param {Object}   options
 * @param {string}   options.pageSlug
 * @param {Object[]} options.filters
 * @param {Object}   options.view
 */
const useUrlFilterWriter = ({ pageSlug, filters, view }) => {
	const history = useHistory();
	const lastWrittenRef = useRef('');

	useEffect(() => {
		if (!view) return;
		const params = { page: pageSlug };
		for (const cfg of filters) {
			const filter = view.filters?.find((f) => f.field === cfg.field);
			const value = filter?.value;
			const isDefault =
				cfg.defaultValue !== undefined && value === cfg.defaultValue;
			if (value === undefined || isDefault) continue;
			const serialize = cfg.serialize || defaultSerialize;
			const serialised = serialize(value, !!cfg.multiple);
			if (serialised === undefined) continue;
			params[cfg.urlKey] = serialised;
		}
		const next = JSON.stringify(params);
		if (next === lastWrittenRef.current) return;
		lastWrittenRef.current = next;
		history.replace(params);
	}, [view, history, pageSlug, filters]);
};

/**
 * Convenience: combines `readInitialFiltersFromUrl` (memoised once) with the
 * effect-only writer. Pass `view` after `useDataViewState` resolves it.
 *
 * @returns {{ initialViewFilters: Array }}
 */
const useUrlFilterSync = ({ pageSlug, filters, view }) => {
	const initialViewFilters = useMemo(
		() => readInitialFiltersFromUrl(filters),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	useUrlFilterWriter({ pageSlug, filters, view });
	return { initialViewFilters };
};

export { useUrlFilterWriter };
export default useUrlFilterSync;

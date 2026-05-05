// URL ↔ filter serialiser. Each filter config declares `urlKey` and
// optionally `serialize` / `deserialize` (or `multiple: true` for comma-
// joined arrays). Defaults are stripped so the URL stays minimal.
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

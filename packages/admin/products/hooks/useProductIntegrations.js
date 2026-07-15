import { useEffect, useRef, useState } from 'react';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

export default function useProductIntegrations(records, enabled = true) {
	const [integrationsByProduct, setIntegrationsByProduct] = useState({});
	const [providers, setProviders] = useState({});
	const [itemLabels, setItemLabels] = useState({});
	const prevKeyRef = useRef('');

	useEffect(() => {
		// Reset dedupe key + cached state so a re-enable refetches instead of
		// briefly showing data from the last visible set.
		if (!enabled) {
			prevKeyRef.current = '';
			setIntegrationsByProduct((s) => (Object.keys(s).length ? {} : s));
			setProviders((s) => (Object.keys(s).length ? {} : s));
			setItemLabels((s) => (Object.keys(s).length ? {} : s));
			return;
		}
		if (!records?.length) return;
		const ids = records.map((r) => r.id);
		const key = ids.join(',');
		if (key === prevKeyRef.current) return;
		prevKeyRef.current = key;

		const controller = new AbortController();
		(async () => {
			try {
				const integrations = await apiFetch({
					path: addQueryArgs('/surecart/v1/integrations', {
						model_ids: ids,
						per_page: 100,
						context: 'edit',
					}),
					signal: controller.signal,
				});

				const grouped = {};
				for (const integration of integrations) {
					(grouped[integration.model_id] ||= []).push(integration);
				}
				setIntegrationsByProduct(grouped);

				if (!integrations.length) return;

				// Provider metadata — one request per unique provider slug.
				const uniqueProviders = [
					...new Set(integrations.map((i) => i.provider)),
				];
				const providerResults = await Promise.all(
					uniqueProviders.map((slug) =>
						apiFetch({
							path: addQueryArgs(
								`/surecart/v1/integration_providers/${slug}`,
								{ context: 'edit', provider: slug }
							),
							signal: controller.signal,
						}).catch(() => null)
					)
				);
				const providerMap = {};
				uniqueProviders.forEach((slug, i) => {
					if (providerResults[i])
						providerMap[slug] = providerResults[i];
				});
				setProviders(providerMap);

				// Per-item labels — one request per unique (provider, item) pair.
				const uniqueItems = new Map();
				for (const integration of integrations) {
					const k = `${integration.provider}:${integration.integration_id}`;
					if (!uniqueItems.has(k)) uniqueItems.set(k, integration);
				}
				const itemEntries = [...uniqueItems.values()];
				const itemResults = await Promise.all(
					itemEntries.map((integration) =>
						apiFetch({
							path: addQueryArgs(
								`/surecart/v1/integration_provider_items/${integration.integration_id}`,
								{
									context: 'edit',
									provider: integration.provider,
								}
							),
							signal: controller.signal,
						}).catch(() => null)
					)
				);
				const labelMap = {};
				itemEntries.forEach((integration, i) => {
					if (itemResults[i]?.label) {
						labelMap[integration.integration_id] =
							itemResults[i].label;
					}
				});
				setItemLabels(labelMap);
			} catch (err) {
				// Aborts fire on cleanup/refetch — expected, swallow silently.
				if (err?.name === 'AbortError') return;
				console.error(
					'[SureCart] Failed to load product integrations:',
					err
				);
			}
		})();

		return () => controller.abort();
	}, [records, enabled]);

	return { integrationsByProduct, providers, itemLabels };
}

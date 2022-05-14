/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import SelectModel from '../../../components/SelectModel';
import { store } from '../../../store/data';
import { ScAlert, ScFormControl } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';

export default ({ model, position, provider, setProvider, item, setItem }) => {
	const [loadingProviders, setLoadingProviders] = useState(false);
	const [itemChoices, setItemChoices] = useState([]);
	const [loadingItemChoices, setLoadingItemChoices] = useState(false);
	const [error, setError] = useState(false);

	const providers = useSelect((select) =>
		select(store).selectCollection('integration_provider')
	);
	const { receiveModels } = useDispatch(store);

	useEffect(() => {
		fetchProviders();
	}, []);

	useEffect(() => {
		if (provider) {
			fetchItemChoices();
		}
	}, [provider]);

	const fetchProviders = async () => {
		try {
			setLoadingProviders(true);
			const response = await apiFetch({
				path: addQueryArgs(`surecart/v1/integration_providers`, {
					context: 'edit',
					model,
					per_page: 100,
				}),
			});
			receiveModels(
				response.map(({ name: providerName, slug }) => ({
					object: 'integration_provider',
					id: slug,
					name: providerName,
				}))
			);
		} catch (e) {
			console.log(e);
			setError(e?.message || __('An error occurred', 'surecart'));
		} finally {
			setLoadingProviders(false);
		}
	};

	const fetchItemChoices = async () => {
		try {
			setItemChoices([]);
			setLoadingItemChoices(true);
			const response = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/integration_providers/${provider}`,
					{
						context: 'edit',
						model,
						per_page: 100,
					}
				),
			});
			setItemChoices(response);
		} catch (e) {
			console.log(e);
			setError(e?.message || __('An error occurred', 'surecart'));
		} finally {
			setLoadingItemChoices(false);
		}
	};

	const renderItemChoices = () => {
		return (
			<div hidden={!provider}>
				<ScFormControl label={__('Item', 'surecart')} required>
					<SelectModel
						placeholder={__('Select an Item', 'surecart')}
						position={position || 'bottom-left'}
						choices={itemChoices || []}
						loading={loadingItemChoices}
						name="item"
						required
						value={item}
						onSelect={setItem}
					/>
				</ScFormControl>
			</div>
		);
	};

	return (
		<>
			<ScAlert type="danger" open={error}>
				{error}
			</ScAlert>

			<p>
				{__(
					'A product purchase will be automatically synced with this item.',
					'surecart'
				)}
			</p>

			<div>
				<ScFormControl label={__('Integration', 'surecart')} required>
					<SelectModel
						placeholder={__('Select An Integration', 'surecart')}
						position={position || 'bottom-left'}
						choices={(providers || []).map((provider) => ({
							label: provider.name,
							value: provider.slug,
						}))}
						value={provider}
						loading={loadingProviders}
						name="integration"
						required
						onSelect={setProvider}
					/>
				</ScFormControl>
			</div>

			{renderItemChoices()}
		</>
	);
};

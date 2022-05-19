import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import SelectModel from '../../../components/SelectModel';
import { ScFormControl } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';

export default ({
	model,
	position,
	providerName,
	setProvider,
	item,
	setItem,
}) => {
	const { providers, loadingProviders } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'integration_provider',
			{ context: 'edit', model },
		];
		return {
			providers: select(coreStore).getEntityRecords(...queryArgs),
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	}, []);

	const provider = providers?.find((p) => p.name === providerName);

	const { items, loadingItems } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'integration_provider_item',
				{ context: 'edit', model, provider: providerName },
			];
			if (!providerName) return { items: [], loadingItems: false };
			return {
				items: select(coreStore).getEntityRecords(...queryArgs),
				loadingItems: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[providerName]
	);

	useEffect(() => {
		setItem('');
	}, [providerName]);

	return (
		<Fragment>
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
							label: provider.label,
							value: provider.name,
							icon: provider.logo,
						}))}
						value={providerName}
						loading={loadingProviders}
						name="integration"
						required
						onSelect={setProvider}
					/>
				</ScFormControl>
			</div>

			<div hidden={!providerName}>
				<ScFormControl
					label={provider?.item_label || __('Item', 'surecart')}
					help={provider?.item_help}
					required
				>
					<SelectModel
						placeholder={__('Select an Item', 'surecart')}
						position={position || 'bottom-left'}
						choices={(items || []).map(({ id, label }) => {
							return {
								value: id,
								label,
							};
						})}
						loading={loadingItems}
						name="item"
						required
						value={item}
						onSelect={setItem}
					/>
				</ScFormControl>
			</div>
		</Fragment>
	);
};

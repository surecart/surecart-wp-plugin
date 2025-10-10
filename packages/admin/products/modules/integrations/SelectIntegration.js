import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import SelectModel from '../../../components/SelectModel';
import { ScFormControl } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

export default ({
	model,
	position,
	providerName,
	setProvider,
	item,
	setItem,
}) => {
	const [search, setSearch] = useState(null);
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
				{
					context: 'edit',
					per_page: 100, // let's get as many as we can by default.
					model,
					provider: providerName,
					search,
				},
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
		[providerName, search]
	);

	useEffect(() => {
		setItem('');
	}, [providerName]);

	return (
		<Fragment>
			<div>
				<ScFormControl
					label={__('Integration', 'surecart')}
					help={__(
						'Select an integration to sync with this product.',
						'surecart'
					)}
					required
				>
					<SelectModel
						placeholder={__('Select An Integration', 'surecart')}
						position={position || 'bottom-left'}
						choices={(providers || []).map((provider) => ({
							label: provider.label,
							value: provider.name,
							icon: provider.logo,
							disabled: provider.disabled,
						}))}
						value={providerName}
						loading={loadingProviders}
						name="integration"
						required
						onSelect={setProvider}
					>
						<sc-menu-divider slot="suffix"></sc-menu-divider>
						<sc-menu-item
							slot="suffix"
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
								tab: 'integrations',
							})}
						>
							{__('View More', 'surecart')}
							<sc-icon
								name="external-link"
								slot="suffix"
								style={{ fontSize: '14px' }}
							></sc-icon>
						</sc-menu-item>
					</SelectModel>
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
						onQuery={setSearch}
						onFetch={() => setSearch('')}
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

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import SelectModel from '../../../admin/components/SelectModel';
import { ScIcon, ScMenuDivider, ScMenuItem } from '@surecart/components-react';

export default (props) => {
	const [query, setQuery] = useState(null);

	const { templates, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'sc-product',
				{
					query,
					status: 'publish',
				},
			];
			return {
				templates: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	return (
		<SelectModel
			choices={[
				...[
					{
						label: __('Default Template', 'surecart'),
						value: 'default',
					},
				],
				...(templates || []).map((template) => ({
					label:
						template.title?.rendered || __('Untitled', 'surecart'),
					value: template.id,
				})),
			]}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			prefix={
				<div slot="prefix">
					<ScMenuItem onClick={() => {}}>
						<ScIcon slot="prefix" name="plus" />
						{__('Add New', 'surecart')}
					</ScMenuItem>
					<ScMenuDivider />
				</div>
			}
			{...props}
		/>
	);
};

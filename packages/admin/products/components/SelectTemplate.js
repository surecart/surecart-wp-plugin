import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import SelectModel from '../../../admin/components/SelectModel';
import { ScIcon, ScMenuDivider, ScMenuItem } from '@surecart/components-react';

export default (props) => {
	const [query, setQuery] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);

	const addNew = async () => {
		const newTemplate = await saveEntityRecord(
			'postType',
			'wp_template',
			{
				description: 'test',
				// Slugs need to be strings, so this is for template `404`
				slug: 'this-is-a-test',
				status: 'publish',
				title: 'SureCart Template',
				content: 'asdfasdf',
				is_surecart_template: true,
			},
			{
				throwOnError: true,
			}
		); // Set template before navigating away to avoid initial stale value.
	};

	const { templates, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'postType',
				'wp_template',
				{
					query,
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
						value: null,
					},
				],
				...(templates || []).map((template) => ({
					label:
						template.title?.rendered || __('Untitled', 'surecart'),
					value: template.id,
				})),
			]}
			placeholder={__('Default Template', 'surecart')}
			onQuery={setQuery}
			onFetch={() => setQuery('')}
			loading={loading}
			prefix={
				<div slot="prefix">
					<ScMenuItem onClick={() => addNew()}>
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

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import SelectModel from '../../../admin/components/SelectModel';
import { addQueryArgs } from '@wordpress/url';
import { ScIcon, ScMenuDivider, ScMenuItem } from '@surecart/components-react';
import { Button, Modal } from '@wordpress/components';

export default (props) => {
	const [query, setQuery] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [modal, setModal] = useState(null);

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
				post_types: ['surecart-product'],
			},
			{
				throwOnError: true,
			}
		); // Set template before navigating away to avoid initial stale value.

		window.location.assign(
			addQueryArgs('post.php', {
				post: newTemplate?.wp_id,
				action: 'edit',
			})
		);
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
				templates: (
					select(coreStore).getEntityRecords(...queryArgs) || []
				).filter((template) => template?.theme === 'surecart/surecart'),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	return (
		<>
			<SelectModel
				choices={[
					...(templates || []).map((template) => ({
						label:
							template.title?.rendered ||
							__('Untitled', 'surecart'),
						value: template.id,
					})),
				]}
				placeholder={__('Default Template', 'surecart')}
				onQuery={setQuery}
				onFetch={() => setQuery('')}
				loading={loading}
				prefix={
					<div slot="prefix">
						<ScMenuItem onClick={() => setModal(true)}>
							<ScIcon slot="prefix" name="plus" />
							{__('Add New', 'surecart')}
						</ScMenuItem>
						<ScMenuDivider />
					</div>
				}
				{...props}
			/>
			{modal && (
				<Modal
					title={__('Add New Product Page Template', 'surecart')}
					onRequestClose={() => setModal(false)}
					isFullScreen
				>
					<p>List of templates will go here</p>
					<Button isPrimary onClick={addNew}>
						{__('Create Template', 'surecart')}
					</Button>
				</Modal>
			)}
		</>
	);
};

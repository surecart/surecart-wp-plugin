/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import {
	ScButton,
	ScIcon,
	ScInput,
	ScMenuDivider,
	ScMenuItem,
} from '@surecart/components-react';
import {
	__experimentalNavigation as Navigation,
	__experimentalNavigationGroup as NavigationGroup,
	__experimentalNavigationItem as NavigationItem,
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { Button, Modal } from '@wordpress/components';
import { BlockPreview } from '@wordpress/block-editor';

function PatternCategoriesList({
	selectedCategory,
	patternCategories,
	onClickCategory,
}) {
	return patternCategories.map(({ name, label }) => {
		return (
			<Button
				key={name}
				label={label}
				isPressed={selectedCategory === name}
				onClick={() => {
					onClickCategory(name);
				}}
			>
				{label}
			</Button>
		);
	});
}

export default ({ label, value }) => {
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

	const { template, loadingTemplate } = useSelect(
		(select) => {
			const queryArgs = ['postType', 'wp_template', value];
			return {
				template: select(coreStore).getEditedEntityRecord(...queryArgs),
				loadingTemplate: select(coreStore).isResolving(
					'getEditedEntityRecord',
					queryArgs
				),
			};
		},
		[value]
	);

	const blocks = [];

	blocks.push(
		createBlock('surecart/buy-button', {
			line_items: [
				{
					price_id: 'test',
					quantity: 1,
				},
			],
			price_id: 'test',
			label: 'Buy Now',
		})
	);

	return (
		<>
			<ScInput
				label={label}
				readonly
				value={
					template.title?.rendered ||
					__('Default Template', 'surecart')
				}
				onClick={() => setModal(true)}
			>
				<ScButton type="text" slot="suffix">
					<ScIcon name="menu" />
				</ScButton>
			</ScInput>
			{/* <SelectModel
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
			/> */}
			{modal && (
				<Modal
					title={__('Template', 'surecart')}
					onRequestClose={() => setModal(false)}
					isFullScreen
				>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							height: 100%;
							gap: 1em;
							box-sizing: border-box;
						`}
					>
						<div
							css={css`
								flex: 1;
								display: flex;
								align-items: stretch;
								gap: 64px;
								background: #1e1e1e;
							`}
						>
							<div
								class="surecart-templates-explorer__sidebar"
								css={css`
									overflow-x: visible;
									overflow-y: scroll;
									width: 360px;
									flex: 0 0 360px;
									color: white;
								`}
							>
								<Navigation>
									<NavigationMenu title="Templates">
										<NavigationItem
											item="default"
											navigateToMenu="default"
											title="Default"
										/>

										<NavigationItem
											item="default"
											navigateToMenu="default"
											title="Custom: Single Product"
										/>
									</NavigationMenu>

									<NavigationMenu
										backButtonLabel="Home"
										menu="default"
										parentMenu="root"
										title="Default"
									>
										<NavigationItem
											isText
											item="item-text-only"
											title="This is just text, doesn't have any functionality"
										/>
									</NavigationMenu>
								</Navigation>
								{/* <PatternCategoriesList
									selectedCategory={'all'}
									patternCategories={[
										{
											name: 'all',
											label: __('All', 'surecart'),
										},
										{
											name: 'buttons',
											label: __('Buttons', 'surecart'),
										},
									]}
									onClickCategory={() => {}}
								/> */}
							</div>
							<div
								css={css`
									flex: 1;
									background: #fff;
									padding: 32px;
									margin: 32px;
									border-radius: 12px;
								`}
							>
								<BlockPreview
									blocks={blocks}
									viewportWidth={800}
								/>
							</div>
						</div>

						<div
							css={css`
								display: flex;
								justify-content: flex-end;
							`}
						>
							<Button isPrimary onClick={addNew}>
								{__('Create Template', 'surecart')}
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

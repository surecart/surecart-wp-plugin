/** @jsx jsx */
import {
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { CeTabGroup } from '@checkout-engine/components-react';

export default ({ clientId }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const { updateBlockAttributes, insertBlocks, replaceInnerBlocks } =
		useDispatch(blockEditorStore);

	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		orientation: 'horizontal',
		templateLock: 'all',
		renderAppender: false,
		template: [
			['checkout-engine/dashboard-tabs', {}],
			['checkout-engine/dashboard-pages', {}],
		],
	});

	const { tabBlocks, panelBlocks, panelsWrapper, tabsWrapper } = useSelect(
		(select) => {
			const innerBlocks = select('core/block-editor').getBlocks(clientId);
			console.log({ innerBlocks });
			const tabsWrapper = (innerBlocks || []).find(
				(block) => block.name === 'checkout-engine/dashboard-tabs'
			);
			const panelsWrapper = (innerBlocks || []).find(
				(block) => block.name === 'checkout-engine/dashboard-pages'
			);
			return {
				tabsWrapper,
				panelsWrapper,
				tabBlocks: select('core/block-editor').getBlocks(
					tabsWrapper?.clientId
				),
				panelBlocks: select('core/block-editor').getBlocks(
					panelsWrapper?.clientId
				),
			};
		},
		[clientId]
	);

	const previousTabBlocks = useRef(tabBlocks);
	const previousPanelBlocks = useRef(panelBlocks);

	useEffect(() => {
		// sync panel
		(tabBlocks || []).forEach((tabBlock) => {
			const panelBlock = panelBlocks.find(
				(panelBlock) =>
					panelBlock.attributes.id === tabBlock.attributes.id
			);
			if (panelBlock) {
				updateBlockAttributes(panelBlock.clientId, {
					name: tabBlock.attributes.panel,
				});
			}
		});

		// Tab is added
		if (previousTabBlocks.current.length < tabBlocks.length) {
			const addedTab = tabBlocks.find(
				(tab) =>
					!previousTabBlocks.current.find(
						(previousTab) => previousTab.clientId === tab.clientId
					)
			);

			const title = sprintf(
				__('New Tab %d', 'checkout_engine'),
				tabBlocks.length
			);

			const name = title
				.toLowerCase()
				.replace(/ /g, '-')
				.replace(/[^\w-]+/g, '');

			updateBlockAttributes(addedTab.clientId, {
				id: addedTab.clientId,
				title: title,
				active: true,
				panel: name,
			});

			const panel = createBlock(
				'checkout-engine/dashboard-page',
				{
					id: addedTab.clientId,
					name,
					title,
				},
				[]
			);

			insertBlocks(panel, 0, panelsWrapper.clientId);
		}

		// Tab is removed.
		if (previousTabBlocks.current.length > tabBlocks.length) {
			const removedTab = previousTabBlocks.current.find(
				(tab) =>
					!tabBlocks.find(
						(previousTab) => previousTab.clientId === tab.clientId
					)
			);

			const innerBlocks = panelBlocks.filter(
				(panelBlock) =>
					panelBlock.attributes.id !== removedTab.attributes.id
			);

			replaceInnerBlocks(panelsWrapper.clientId, innerBlocks);
		}

		// Panel is removed.
		if (previousPanelBlocks.current.length > panelBlocks.length) {
			const removedPanel = previousPanelBlocks.current.find(
				(panel) =>
					!panelBlocks.find(
						(previousPanel) =>
							previousPanel.clientId === panel.clientId
					)
			);

			const innerBlocks = tabBlocks.filter(
				(tabBlock) =>
					tabBlock.attributes.id !== removedPanel.attributes.id
			);

			replaceInnerBlocks(tabsWrapper.clientId, innerBlocks);
		}

		previousTabBlocks.current = tabBlocks;
		previousPanelBlocks.current = panelBlocks;
	}, [tabBlocks, panelBlocks]);

	return (
		<CeTabGroup
			{...innerBlocksProps}
			css={css`
				.block-list-appender {
					position: relative !important;
					box-sizing: border-box !important;
					opacity: 0.25;
					transition: opacity 0.25s ease;

					&:hover {
						opacity: 1;
					}
				}
			`}
		></CeTabGroup>
	);
};

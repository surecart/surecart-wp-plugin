/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { Button, TabPanel } from '@wordpress/components';
import {
	useFocusOnMount,
	useFocusReturn,
	useMergeRefs,
} from '@wordpress/compose';
import { useRef, useState, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';
import { __experimentalListView as ListView } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';

export default function DocumentOverviewSidebar() {
	const { setIsDocumentOverviewOpened: setIsListViewOpened } =
		useContext(EditorContext);

	// This hook handles focus when the sidebar first renders.
	const focusOnMountRef = useFocusOnMount('firstElement');
	// The next 2 hooks handle focus for when the sidebar closes and returning focus to the element that had focus before sidebar opened.
	const headerFocusReturnRef = useFocusReturn();
	const contentFocusReturnRef = useFocusReturn();

	const closeOnEscape = (event) => {
		if (event.code === 'Escape' && !event.defaultPrevented) {
			event.preventDefault();
			setIsListViewOpened(false);
		}
	};

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the dropZoneElement updates.
	const [dropZoneElement, setDropZoneElement] = useState(null);
	// Tracks our current tab.
	const [tab, setTab] = useState('list-view');

	// This ref refers to the list view application area.
	const listViewRef = useRef < HTMLDivElement > null;

	// Must merge the refs together so focus can be handled properly in the next function.
	const listViewContainerRef = useMergeRefs([
		contentFocusReturnRef,
		focusOnMountRef,
		listViewRef,
		setDropZoneElement,
	]);

	/**
	 * Render tab content for a given tab name.
	 *
	 * @param tabName The name of the tab to render.
	 */
	const renderTabContent = (tabName) => {
		if (tabName === 'list-view') {
			return <ListView dropZoneElement={dropZoneElement} />;
		}
		return null;
	};

	return (
		<div
			onKeyDown={closeOnEscape}
			css={css`
				position: relative;
				width: 350px;
				height: 100%;
				border-right: 1px solid var(--sc-color-gray-400);
				background: #fff;

				@media only screen and (max-width: 768px) {
					width: 100%;
					position: absolute;
					z-index: 100;
				}
			`}
		>
			<Button
				ref={headerFocusReturnRef}
				icon={closeSmall}
				label={__('Close', 'surecart')}
				onClick={() => setIsListViewOpened(false)}
				css={css`
					position: absolute;
					right: calc(16px - 2px);
					top: calc(16px - 2px);
				`}
			/>
			<TabPanel
				className="surecart-editor__document-overview-sidebar-tab-panel"
				initialTabName={tab}
				onSelect={setTab}
				tabs={[
					{
						name: 'list-view',
						title: __('List View', 'surecart'),
						className:
							'surecart-editor__document-overview-sidebar-tab-item',
					},
				]}
				css={css`
					height: 100%;
				`}
			>
				{(currentTab) => (
					<div
						className="surecart-editor__document-overview-sidebar-tab-content"
						ref={listViewContainerRef}
						css={css`
							height: 100%;
							overflow-x: hidden;
							overflow-y: auto;
							padding: 16px calc(16px - 2px);
						`}
					>
						{renderTabContent(currentTab.name)}
					</div>
				)}
			</TabPanel>
		</div>
	);
}

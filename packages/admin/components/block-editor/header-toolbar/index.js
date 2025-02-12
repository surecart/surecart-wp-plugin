/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { plus, next, previous } from '@wordpress/icons';
import {
	useRef,
	useCallback,
	useContext,
	useState,
	useEffect,
} from '@wordpress/element';
import classnames from 'classnames';
import { Button, Popover, ToolbarItem } from '@wordpress/components';
import { store as preferencesStore } from '@wordpress/preferences';
import {
	NavigableToolbar,
	store as blockEditorStore,
	ToolSelector,
	BlockToolbar,
} from '@wordpress/block-editor';
import { PinnedItems } from '@wordpress/interface';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';
import { SIDEBAR_COMPLEMENTARY_AREA_SCOPE } from '../constants';
import DocumentOverview from './DocumentOverview';
import EditorHistoryRedo from './EditorHistoryRedo';
import EditorHistoryUndo from './EditorHistoryUndo';
import MoreMenu from './MoreMenu';

export default function ({ onSave = () => {}, onCancel = () => {} }) {
	const { isInserterOpened, setIsInserterOpened } = useContext(EditorContext);
	const [isBlockToolsCollapsed, setIsBlockToolsCollapsed] = useState(true);
	const isLargeViewport = useViewportMatch('medium');
	const inserterButton = useRef();
	const {
		isInserterEnabled,
		isTextModeEnabled,
		hasBlockSelection,
		hasFixedToolbar,
	} = useSelect((select) => {
		const {
			hasInserterItems,
			getBlockRootClientId,
			getBlockSelectionEnd,
			__unstableGetEditorMode: getEditorMode,
			getBlockSelectionStart,
		} = select(blockEditorStore);
		const { get: getPreference } = select(preferencesStore);

		return {
			isTextModeEnabled: getEditorMode() === 'text',
			isInserterEnabled: hasInserterItems(
				getBlockRootClientId(getBlockSelectionEnd() ?? '') ?? undefined
			),
			hasBlockSelection: !!getBlockSelectionStart(),
			hasFixedToolbar: getPreference('core', 'fixedToolbar'),
		};
	}, []);

	const toggleInserter = useCallback(
		() => setIsInserterOpened(!isInserterOpened),
		[isInserterOpened, setIsInserterOpened]
	);

	useEffect(() => {
		// If we have a new block selection, show the block tools
		if (hasBlockSelection) {
			setIsBlockToolsCollapsed(false);
		}
	}, [hasBlockSelection]);

	const renderBlockToolbar = true;

	return (
		<div
			css={css`
				padding: 8px 10px 2px;
				border: 0;
				border-bottom: 1px solid #ccc;
				display: flex;
				align-items: center;
				justify-content: space-between;
			`}
		>
			<div
				css={css`
					align-items: center;
					display: flex;
				`}
			>
				<NavigableToolbar
					className="surecart-editor-document-tools"
					aria-label={__('Document tools', 'surecart')}
					variant="unstyled"
					css={css`
						border: 1px solid #1e1e1e;
						border-radius: 2px;
						display: inline-flex;
						flex-shrink: 0;
					`}
				>
					<div
						css={css`
							align-items: center;
							display: inline-flex;
							gap: 8px;
							margin-right: 8px;
						`}
					>
						<ToolbarItem
							ref={inserterButton}
							as={Button}
							variant="primary"
							isPressed={isInserterOpened}
							onMouseDown={(event) => {
								event.preventDefault();
							}}
							onClick={toggleInserter}
							disabled={!isInserterEnabled}
							icon={plus}
							label={__('Toggle block inserter', 'surecart')}
							aria-expanded={isInserterOpened}
							showTooltip
							css={css`
								background: transparent !important;
								&:before {
									background: var(--wp-components-color-accent,var(--wp-admin-theme-color,#3858e9));
								}
							`}
						/>
						{isLargeViewport && (
							<ToolbarItem
								as={ToolSelector}
								disabled={isTextModeEnabled}
								size="compact"
							/>
						)}
						<ToolbarItem as={EditorHistoryUndo} size="compact" />
						<ToolbarItem as={EditorHistoryRedo} size="compact" />
						<ToolbarItem as={DocumentOverview} size="compact" />
					</div>
				</NavigableToolbar>
				{hasFixedToolbar && isLargeViewport && renderBlockToolbar && (
					<>
						<div
							className={classnames(
								'selected-block-tools-wrapper',
								{
									'is-collapsed': isBlockToolsCollapsed,
								}
							)}
						>
							<BlockToolbar hideDragHandle />
						</div>
						<Popover.Slot name="block-toolbar" />
						{hasBlockSelection && (
							<Button
								className="edit-post-header__block-tools-toggle"
								icon={isBlockToolsCollapsed ? next : previous}
								onClick={() => {
									setIsBlockToolsCollapsed(
										(collapsed) => !collapsed
									);
								}}
								label={
									isBlockToolsCollapsed
										? __('Show block tools', 'surecart')
										: __('Hide block tools', 'surecart')
								}
							/>
						)}
					</>
				)}
			</div>
			<div
				css={css`
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 8px;
				`}
			>
				<Button
					variant="tertiary"
					onClick={onCancel}
					text={__('Cancel', 'surecart')}
					css={css`
						display: flex;
					`}
				/>
				<Button
					variant="primary"
					onClick={onSave}
					text={__('Done', 'surecart')}
				/>
				<PinnedItems.Slot scope={SIDEBAR_COMPLEMENTARY_AREA_SCOPE} />
				<MoreMenu />
			</div>
		</div>
	);
}

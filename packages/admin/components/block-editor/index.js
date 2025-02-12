/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

/**
 * External dependencies.
 */
import { Popover, Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from '@wordpress/element';
import { PluginArea } from '@wordpress/plugins';
import { store as preferencesStore } from '@wordpress/preferences';
import {
	BlockEditorProvider,
	BlockList,
	BlockTools,
	BlockEditorKeyboardShortcuts,
	store as blockEditorStore,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';
import { ComplementaryArea } from '@wordpress/interface';
import { uploadMedia } from '@wordpress/media-utils';
import { arrowLeft } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { EditorContext } from './context';
import { useEditorHistory } from './hooks/use-editor-history';
import { SIDEBAR_COMPLEMENTARY_AREA_SCOPE } from './constants';
import { areBlocksEmpty } from './utils/are-blocks-empty';
import HeaderToolbar from './header-toolbar';
import SecondarySidebar from './sidebar/SecondarySidebar';
import SettingsSidebar from './sidebar/SettingsSidebar';
import RegisterStores from './RegisterStores';
import KeyboardShortcuts from './keyboard-shortcuts';
import RegisterKeyboardShortcuts from './keyboard-shortcuts/RegisterKeyboardShortcuts';
import EditorResizer from './editor-resizer';

const setIsInserterOpenedAction = 'SET_IS_INSERTER_OPENED';
const setIsListViewOpenedAction = 'SET_IS_LISTVIEW_OPENED';
const initialSidebarState = {
	isInserterOpened: false,
	isListViewOpened: false,
};

function sidebarReducer(state, action) {
	switch (action.type) {
		case setIsInserterOpenedAction: {
			return {
				...state,
				isInserterOpened: action.value,
				isListViewOpened: action.value ? false : state.isListViewOpened,
			};
		}
		case setIsListViewOpenedAction: {
			return {
				...state,
				isListViewOpened: action.value,
				isInserterOpened: action.value ? false : state.isInserterOpened,
			};
		}
	}
	return state;
}

export default function ({
	blocks,
	setBlocks,
	onChange = () => {},
	onSave = () => {},
	onClose,
	onCancel,
	onInput = () => {},
	settings: __settings,
	showBackButton = false,
	name,
}) {
	const [temporalBlocks, setTemporalBlocks] = useState([]);
	const canUserCreateMedia = useSelect((select) => {
		const _canUserCreateMedia = select('core').canUser('create', 'media');
		return _canUserCreateMedia || _canUserCreateMedia !== false;
	}, []);

	const {
		appendEdit: appendToEditorHistory,
		hasRedo,
		hasUndo,
		redo,
		undo,
	} = useEditorHistory({
		setBlocks: setTemporalBlocks,
	});

	/*
	 * Set the initial blocks from the store.
	 */
	useEffect(() => {
		appendToEditorHistory(blocks);
		setTemporalBlocks(blocks);
	}, []);

	const [{ isInserterOpened, isListViewOpened }, dispatch] = useReducer(
		sidebarReducer,
		initialSidebarState
	);

	const setIsInserterOpened = useCallback((value) => {
		dispatch({
			type: setIsInserterOpenedAction,
			value,
		});
	}, []);

	const setIsListViewOpened = useCallback((value) => {
		dispatch({
			type: setIsListViewOpenedAction,
			value,
		});
	}, []);

	const { clearSelectedBlock, updateSettings } =
		useDispatch(blockEditorStore);

	const parentEditorSettings = useSelect((select) => {
		return select(blockEditorStore).getSettings();
	}, []);

	const { hasFixedToolbar } = useSelect((select) => {
		const { get: getPreference } = select(preferencesStore);

		return {
			hasFixedToolbar: getPreference('core', 'fixedToolbar'),
		};
	}, []);

	const settings = useMemo(() => {
		if (!canUserCreateMedia) {
			return surecartBlockEditorSettings;
		}

		return {
			...surecartBlockEditorSettings,
			mediaUpload({ onError, ...rest }) {
				uploadMedia({
					wpAllowedMimeTypes:
						surecartBlockEditorSettings.allowedMimeTypes,
					onError: ({ message }) => onError(message),
					...rest,
				});
			},
		};
	}, [canUserCreateMedia, parentEditorSettings]);

	const handleBlockEditorProviderOnChange = (updatedBlocks) => {
		appendToEditorHistory(updatedBlocks);
		setTemporalBlocks(updatedBlocks);
		onChange(updatedBlocks);
	};

	const handleBlockEditorProviderOnInput = (updatedBlocks) => {
		appendToEditorHistory(updatedBlocks);
		setTemporalBlocks(updatedBlocks);
		onInput(updatedBlocks);
	};

	const inlineFixedBlockToolbar = true;
	const editorSettings =
		__settings || surecartBlockEditorSettings || parentEditorSettings;

	useEffect(() => {
		// Manually update the settings so that __unstableResolvedAssets gets added to the data store.
		updateSettings(editorSettings);
	}, []);

	const [editorHeight, setEditorHeight] = useState(0);
	useEffect(() => {
		const calculateHeight = () => {
			const windowHeight = window.innerHeight;
			const headerHeight = 150;
			const footerHeight = 50;

			const calculatedHeight =
				windowHeight - headerHeight - footerHeight - 50;
			setEditorHeight(calculatedHeight);
		};

		// Calculate height on mount and on window resize.
		calculateHeight();
		window.addEventListener('resize', calculateHeight);

		// Cleanup event listener on unmount.
		return () => {
			window.removeEventListener('resize', calculateHeight);
		};
	}, []);

	return (
		<div
			className="surecart-editor"
			css={css`
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				height: 100%;
			`}
		>
			<Global
				styles={css`
					html :where(.wp-block) {
						max-width: 100% !important;
					}
				`}
			/>
			<EditorContext.Provider
				value={{
					hasRedo,
					hasUndo,
					isInserterOpened,
					isDocumentOverviewOpened: isListViewOpened,
					redo,
					setIsInserterOpened,
					setIsDocumentOverviewOpened: setIsListViewOpened,
					undo,
				}}
			>
				<BlockEditorProvider
					settings={{
						...settings,
						hasFixedToolbar:
							hasFixedToolbar || !inlineFixedBlockToolbar,
						templateLock: false,
					}}
					value={temporalBlocks}
					onChange={handleBlockEditorProviderOnChange}
					onInput={handleBlockEditorProviderOnInput}
					useSubRegistry={true}
				>
					<RegisterStores />

					<KeyboardShortcuts />
					<RegisterKeyboardShortcuts />

					<HeaderToolbar
						onSave={() => {
							setBlocks(
								areBlocksEmpty(temporalBlocks)
									? []
									: temporalBlocks
							);
							onChange(temporalBlocks);
							onSave();
						}}
						onCancel={onCancel}
					/>
					<div
						className="surecart-editor__main"
						css={css`
							align-items: flex-start;
							display: flex;
							flex-direction: row;
							flex-grow: 1;
							width: 100%;
							height: 100%;
							overflow: hidden;
							z-index: 1000;
						`}
					>
						<SecondarySidebar />
						<BlockTools
							className="surecart-editor__content"
							css={css`
								position: relative;
								flex-grow: 1;
								display: flex;
								background: #2f2f2f;
								justify-content: center;
								padding: 40px 48px;
								height: 100%;
								border-top: 0px;
								border-bottom: 0px;
							`}
							onClick={(event) => {
								// Clear selected block when clicking on the gray background.
								if (event.target === event.currentTarget) {
									clearSelectedBlock();
								}
							}}
						>
							<BlockEditorKeyboardShortcuts.Register />
							{showBackButton && onClose && (
								<Button
									icon={arrowLeft}
									onClick={() => {
										setTimeout(onClose, 550);
									}}
									css={css`
										align-self: flex-start;
										margin-top: var(--sc-spacing-small);
										margin-bottom: var(--sc-spacing-small);
										color: white;
									`}
								>
									{__('Back', 'surecart')}
								</Button>
							)}

							<EditorResizer enableResizing={true} height="100%">
								<WritingFlow
									css={css`
										overflow-y: auto;
										height: ${editorHeight}px;
										width: 100%;
										padding: 5px;
									`}
								>
									<ObserveTyping>
										<BlockList className="edit-site-block-editor__block-list wp-site-blocks" />
									</ObserveTyping>
								</WritingFlow>
							</EditorResizer>

							<Popover.Slot />
							<div className="surecart-editor__content-inserter-clipper" />
						</BlockTools>
						<ComplementaryArea.Slot
							scope={SIDEBAR_COMPLEMENTARY_AREA_SCOPE}
						/>
					</div>
					<PluginArea scope="surecart-block-editor-modal-block-editor" />
					<SettingsSidebar
						height={editorHeight + 30}
						smallScreenTitle={name}
					/>
				</BlockEditorProvider>
			</EditorContext.Provider>
		</div>
	);
}

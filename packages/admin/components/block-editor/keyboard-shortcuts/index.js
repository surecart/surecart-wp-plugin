/**
 * External dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';
import {
	SETTINGS_SIDEBAR_IDENTIFIER,
	SIDEBAR_COMPLEMENTARY_AREA_SCOPE,
} from '../constants';

export default function () {
	const {
		isDocumentOverviewOpened: isListViewOpened,
		redo,
		setIsDocumentOverviewOpened: setIsListViewOpened,
		undo,
	} = useContext(EditorContext);

	const { isSettingsSidebarOpen } = useSelect((select) => {
		const { getActiveComplementaryArea } = select(interfaceStore);

		return {
			isSettingsSidebarOpen:
				getActiveComplementaryArea(SIDEBAR_COMPLEMENTARY_AREA_SCOPE) ===
				SETTINGS_SIDEBAR_IDENTIFIER,
		};
	}, []);

	const { disableComplementaryArea, enableComplementaryArea } =
		useDispatch(interfaceStore);

	useShortcut('surecart/block-editor/modal-block-editor/undo', (event) => {
		undo();
		event.preventDefault();
	});

	useShortcut('surecart/block-editor/modal-block-editor/redo', (event) => {
		redo();
		event.preventDefault();
	});

	useShortcut(
		'surecart/block-editor/modal-block-editor/toggle-list-view',
		(event) => {
			setIsListViewOpened(!isListViewOpened);
			event.preventDefault();
		}
	);

	useShortcut(
		'surecart/block-editor/modal-block-editor/toggle-sidebar',
		(event) => {
			if (isSettingsSidebarOpen) {
				disableComplementaryArea(SIDEBAR_COMPLEMENTARY_AREA_SCOPE);
			} else {
				enableComplementaryArea(
					SIDEBAR_COMPLEMENTARY_AREA_SCOPE,
					SETTINGS_SIDEBAR_IDENTIFIER
				);
			}
			event.preventDefault();
		}
	);

	return null;
}

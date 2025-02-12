/**
 * External dependencies.
 */
import { createContext } from '@wordpress/element';

export const EditorContext = createContext({
	hasRedo: false,
	hasUndo: false,
	isDocumentOverviewOpened: false,
	isInserterOpened: false,
	redo: () => {},
	setIsDocumentOverviewOpened: () => {},
	setIsInserterOpened: () => {},
	undo: () => {},
});

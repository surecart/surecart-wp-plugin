/**
 * External dependencies
 */
import { useDebounce } from '@wordpress/compose';
import { useCallback, useState } from '@wordpress/element';

const DEFAULT_MAX_HISTORY = 50;

export function useEditorHistory({
	maxHistory = DEFAULT_MAX_HISTORY,
	setBlocks,
}) {
	const [edits, setEdits] = useState([]);
	const [offsetIndex, setOffsetIndex] = useState(0);

	const appendEdit = useDebounce(
		useCallback(
			(edit) => {
				const currentEdits = edits.slice(0, offsetIndex + 1);
				const newEdits = [...currentEdits, edit].slice(maxHistory * -1);
				setEdits(newEdits);
				setOffsetIndex(newEdits.length - 1);
			},
			[edits, maxHistory, offsetIndex]
		),
		500
	);

	const undo = useCallback(() => {
		appendEdit.flush();

		const newIndex = Math.max(0, offsetIndex - 1);
		if (!edits[newIndex]) {
			return;
		}
		setBlocks(edits[newIndex]);
		setOffsetIndex(newIndex);
	}, [appendEdit, edits, offsetIndex, setBlocks]);

	const redo = useCallback(() => {
		appendEdit.flush();

		const newIndex = Math.min(edits.length - 1, offsetIndex + 1);
		if (!edits[newIndex]) {
			return;
		}
		setBlocks(edits[newIndex]);
		setOffsetIndex(newIndex);
	}, [appendEdit, edits, offsetIndex, setBlocks]);

	const hasUndo = () => {
		return !!edits.length && offsetIndex > 0;
	};

	const hasRedo = () => {
		return !!edits.length && offsetIndex < edits.length - 1;
	};

	return {
		appendEdit,
		hasRedo: hasRedo(),
		hasUndo: hasUndo(),
		redo,
		undo,
	};
}

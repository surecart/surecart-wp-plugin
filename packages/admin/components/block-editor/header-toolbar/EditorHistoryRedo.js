/**
 * External dependencies.
 */
import { __, isRTL } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { forwardRef, useContext } from '@wordpress/element';

import { redo as redoIcon, undo as undoIcon } from '@wordpress/icons';
import { displayShortcut, isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';

function EditorHistoryRedo(props, ref) {
	const shortcut = isAppleOS()
		? displayShortcut.primaryShift('z')
		: displayShortcut.primary('y');

	const { hasRedo, redo } = useContext(EditorContext);

	return (
		<Button
			{...props}
			ref={ref}
			icon={!isRTL() ? redoIcon : undoIcon}
			label={__('Redo', 'surecart')}
			shortcut={shortcut}
			aria-disabled={!hasRedo}
			onClick={hasRedo ? redo : undefined}
			className="editor-history__redo"
		/>
	);
}

export default forwardRef(EditorHistoryRedo);

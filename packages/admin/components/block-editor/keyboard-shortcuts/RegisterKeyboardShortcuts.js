/**
 * External dependencies.
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { isAppleOS } from '@wordpress/keycodes';

export default function () {
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);

	useEffect(() => {
		registerShortcut({
			name: 'surecart/block-editor/modal-block-editor/undo',
			category: 'global',
			description: __('Undo your last changes.', 'surecart'),
			keyCombination: {
				modifier: 'primary',
				character: 'z',
			},
		});

		registerShortcut({
			name: 'surecart/block-editor/modal-block-editor/redo',
			category: 'global',
			description: __('Redo your last undo.', 'surecart'),
			keyCombination: {
				modifier: 'primaryShift',
				character: 'z',
			},
			// Disable on Apple OS because it conflicts with the browser's
			// history shortcut. It's a fine alias for both Windows and Linux.
			// Since there's no conflict for Ctrl+Shift+Z on both Windows and
			// Linux, we keep it as the default for consistency.
			aliases: isAppleOS()
				? []
				: [
						{
							modifier: 'primary',
							character: 'y',
						},
				  ],
		});

		registerShortcut({
			name: 'surecart/block-editor/modal-block-editor/toggle-list-view',
			category: 'global',
			description: __('Open the block list view.', 'surecart'),
			keyCombination: {
				modifier: 'access',
				character: 'o',
			},
		});

		registerShortcut({
			name: 'surecart/block-editor/modal-block-editor/toggle-sidebar',
			category: 'global',
			description: __('Show or hide the Settings sidebar.', 'surecart'),
			keyCombination: {
				modifier: 'primaryShift',
				character: ',',
			},
		});
	}, [registerShortcut]);

	return null;
}

/**
 * External dependencies.
 */
import { Button } from '@wordpress/components';
import { forwardRef, useContext } from '@wordpress/element';
import { listView as listViewIcon } from '@wordpress/icons';
import { displayShortcut } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';

const DocumentOverview = forwardRef(function ForwardedRefDocumentOverview(
	props,
	ref
) {
	const { isDocumentOverviewOpened, setIsDocumentOverviewOpened } =
		useContext(EditorContext);

	function handleClick() {
		setIsDocumentOverviewOpened(!isDocumentOverviewOpened);
	}

	return (
		<Button
			{...props}
			ref={ref}
			icon={listViewIcon}
			isPressed={isDocumentOverviewOpened}
			/* translators: button label text should, if possible, be under 16 characters. */
			label={__('Document overview', 'surecart')}
			shortcut={displayShortcut.access('o')}
			onClick={handleClick}
			className="document-overview"
		/>
	);
});

export default DocumentOverview;

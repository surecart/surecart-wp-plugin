/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps({
		className: 'sc-close-button',
	});

	return (
		<button {...blockProps} type="button">
			<span className="sc-close-button__icon" aria-hidden="true">
				×
			</span>
			<span className="screen-reader-text">
				{__('Close Review Modal', 'surecart')}
			</span>
		</button>
	);
}

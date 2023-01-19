/**
 * WordPress dependencies
 */
import {
	__experimentalGetElementClassName,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { url, alt } = attributes;

	const borderProps = getBorderClassesAndStyles(attributes);

	return (
		<img
			src={url}
			alt={alt ?? ''}
			className={borderProps.className}
			style={borderProps.style}
			width={'100%'}
			height={'100%'}
		/>
	);
}

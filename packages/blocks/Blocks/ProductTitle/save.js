/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { textAlign } = attributes;

	const className = classnames({
		[`has-text-align-${textAlign}`]: textAlign,
	});

	return useBlockProps.save({ className });
}

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes: { level, textAlign }, setAttributes, context: { name }, }) => {
	const TagName = 0 === level ? 'p' : 'h' + level;

	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	return (
		<>
			<TagName {...blockProps}>{name || "Product Name"}</TagName>
		</>
	);
};

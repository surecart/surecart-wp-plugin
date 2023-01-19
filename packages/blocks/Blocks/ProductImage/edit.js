/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { url, alt } = attributes;

	const { className, style } = useBorderProps(attributes);
	const blockProps = useBlockProps();

	console.log('borderProps :: ', className, style);

	return (
		<Fragment>
			<div {...blockProps}>
				<img
					width={'100%'}
					height={'100%'}
					src={url}
					alt={alt}
					style={{ ...style, boxSizing: 'border-box' }}
					className={className}
				/>
			</div>
		</Fragment>
	);
};

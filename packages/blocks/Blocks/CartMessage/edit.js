/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import {
	RichText,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScText } from '@surecart/components-react';
import useCartBlockProps from '../../hooks/useCartBlockProps';

export default ({ attributes, setAttributes, context }) => {
	const { text, border } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';

	const blockProps = useCartBlockProps({
		slot,
		border,
		props: {
			style: {
				...(colorStyle?.backgroundColor
					? { backgroundColor: colorStyle.backgroundColor }
					: {}),
				...(colorStyle?.background
					? { background: colorStyle.background }
					: {}),
				...(colorStyle?.color ? { color: colorStyle.color } : {}),
			},
		},
	});

	const colorProps = useColorProps(attributes);
	const { style: colorStyle } = colorProps;

	useEffect(() => {
		setAttributes({ slot });
	}, [slot]);

	return (
		<Fragment>
			<div {...blockProps}>
				<ScText
					style={{
						'--font-size': 'var(--sc-font-size-x-small)',
						'--line-height': 'var(--sc-line-height-dense)',
					}}
				>
					<RichText
						aria-label={__('Message Text')}
						placeholder={__('I.E. Free shipping on all orders…')}
						value={text}
						onChange={(text) => setAttributes({ text })}
						withoutInteractiveFormatting
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/strikethrough',
						]}
					/>
				</ScText>
			</div>
		</Fragment>
	);
};

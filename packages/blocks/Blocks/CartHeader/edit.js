/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScCartHeader } from '@surecart/components-react';
import useCartBlockProps from '../../hooks/useCartBlockProps';

export default ({ attributes, setAttributes, context }) => {
	const { text, border } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';
	const blockProps = useCartBlockProps({ slot, border });

	useEffect(() => {
		setAttributes({ slot });
	}, [slot]);

	return (
		<div {...blockProps}>
			<ScCartHeader>
				<RichText
					aria-label={__('Header Text')}
					placeholder={__('Add text…')}
					value={text}
					onChange={(text) => setAttributes({ text })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScCartHeader>
		</div>
	);
};

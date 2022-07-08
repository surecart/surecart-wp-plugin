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
import { ScText } from '@surecart/components-react';
import useCartBlockProps from '../../hooks/useCartBlockProps';

export default ({ attributes, setAttributes, context }) => {
	const { text, border } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';
	const blockProps = useCartBlockProps({ slot, border });

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
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						value={text}
						onChange={(text) => setAttributes({ text })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScText>
			</div>
		</Fragment>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScFormatNumber, ScLineItem } from '@surecart/components-react';
import useCartBlockProps from '../../hooks/useCartBlockProps';

export default ({ attributes, setAttributes, context }) => {
	const { label, border } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';
	const blockProps = useCartBlockProps({ slot, border });

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScLineItem {...blockProps}>
				<span slot="title">{label}</span>
				<ScFormatNumber
					slot="price"
					type="currency"
					value={1234}
					currency={scData?.currency || 'usd'}
				></ScFormatNumber>
			</ScLineItem>
		</Fragment>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	RichText,
} from '@wordpress/block-editor';

import { ScProductDonationChoices } from '@surecart/components-react';
import { getSpacingPresetCssVar } from '../../util';

export default ({ attributes, setAttributes, context }) => {
	const { label, recurring, style } = attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps({
		css: css`
			sc-product-donation-choices.wp-block {
				margin: 0;
			}
		`,
	});

	return (
		<>
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

			<ScProductDonationChoices
				recurring={recurring}
				productId={context['surecart/product-donation/product_id']}
				{...blockProps}
			>
				<RichText
					aria-label={__('Price Selector Text', 'surecart')}
					value={label}
					onChange={(value) => setAttributes({ label: value })}
					allowedFormats={[]}
					withoutInteractiveFormatting
				/>
			</ScProductDonationChoices>
		</>
	);
};

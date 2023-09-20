/** @jsx jsx */
import {
	ScChoice,
	ScFormatNumber,
	ScPriceInput,
} from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency } = attributes;

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label for donation', 'surecart')}
							placeholder={__('Buy me coffee!', 'surecart')}
							value={label}
							onChange={(value) => {
								setAttributes({
									label: value,
								});
							}}
						></TextControl>
					</PanelRow>
					<PanelRow>
						<ScPriceInput
							label={__('Amount', 'surecart')}
							currencyCode={currency}
							value={amount}
							onScInput={(e) =>
								setAttributes({
									amount: parseInt(e.target.value),
								})
							}
						></ScPriceInput>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScChoice 
					showControl={false} 
					size="small"
					css={css`
						width: 100%;
					`}
				>
					{!!label ? (
						label
					) : (
					<ScFormatNumber
						type="currency"
						currency={currency || 'USD'}
						minimum-fraction-digits="0"
					></ScFormatNumber>
					)}
				</ScChoice>
			</div>
		</Fragment>
	);
};

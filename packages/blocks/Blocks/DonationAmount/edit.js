import { ScChoice, ScFormatNumber, ScPriceInput } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency } = attributes;

	const blockProps = useBlockProps();

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
			<ScChoice
				showControl={false}
				size="small"
				value={amount}
				{...blockProps}
			>
				{!!label ? (
					label
				) : (
					<ScFormatNumber
						type="currency"
						currency={currency || 'USD'}
						value={amount}
						minimum-fraction-digits="0"
					></ScFormatNumber>
				)}
			</ScChoice>
		</Fragment>
	);
};

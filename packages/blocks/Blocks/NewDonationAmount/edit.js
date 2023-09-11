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
	const { label, amount, currency, custom_amount } = attributes;

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
					<PanelRow>
						<ToggleControl
							label={__('Custom', 'surecart')}
							help={__(
								'Allow Custom Amount',
								'surecart'
							)}
							checked={custom_amount}
							onChange={(custom_amount) =>
								setAttributes({ custom_amount: ! custom_amount })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScChoice showControl={false} size="small" value={amount}>
					{!!label ? (
						label
					) : (
						!! custom_amount ? (
							<div
								style={css`
									width: 60px;
									width: 60px;
								`}

								slot='price'
							>
								<ScPriceInput
									currencyCode={currency}
									value={amount}
									onScInput={(e) =>
										setAttributes({
											amount: parseInt(e.target.value),
										})
									}
									size="small"
									showCode={false}
									showLabel={false}
								/>
							</div>
						) : (
							<ScFormatNumber
								type="currency"
								currency={currency || 'USD'}
								value={amount}
								minimum-fraction-digits="0"
							></ScFormatNumber>
						)
					)}
				</ScChoice>
			</div>
		</Fragment>
	);
};

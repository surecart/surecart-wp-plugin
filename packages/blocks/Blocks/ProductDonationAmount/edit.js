/** @jsx jsx */
import { ScChoiceContainer, ScPriceInput } from '@surecart/components-react';
import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { getFormattedPrice } from '../../../admin/util';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency } = attributes;
	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});
	const labelCurrency = currency || scBlockData?.currency || 'usd';

	useEffect(() => {
		if (label) return;

		setAttributes({
			label: getFormattedPrice({ amount, currency: labelCurrency }),
			currency: labelCurrency,
		});
	}, [amount, labelCurrency]);

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
							onScChange={(e) => {
								const value = isNaN(parseFloat(e.target.value))
									? 0
									: parseFloat(e.target.value);
								setAttributes({
									amount: value,
								});
							}}
						></ScPriceInput>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScChoiceContainer
					showControl={false}
					css={css`
						width: 100%;
					`}
				>
					<RichText
						aria-label={__('Donation Amount text', 'surecart')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						allowedFormats={[]}
						withoutInteractiveFormatting
					/>
				</ScChoiceContainer>
			</div>
		</Fragment>
	);
};

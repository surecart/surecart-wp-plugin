/** @jsx jsx */
import {
	ScChoiceContainer,
	ScFormatNumber,
	ScPriceInput,
} from '@surecart/components-react';
import {
	InspectorControls,
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { formatNumber } from '../../../admin/util';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency } = attributes;
	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	useEffect(() => {
		if (label) return;
		const formattedNumber = formatNumber(amount, currency);
		setAttributes({
			label: formattedNumber,
		});
	}, [amount, currency]);

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
				<ScChoiceContainer
					showControl={false}
					size="small"
					css={css`
						width: 100%;
					`}
				>
					<RichText
						aria-label={__('Donation Amount text')}
						value={label}
						onChange={(value) => setAttributes({ label: value })}
						withoutInteractiveFormatting
					/>
				</ScChoiceContainer>
			</div>
		</Fragment>
	);
};

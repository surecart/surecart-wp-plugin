/** @jsx jsx */
import {
	ScChoiceContainer,
	ScFormatNumber,
	ScPriceInput,
	ScCustomDonationAmount
} from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency, custom_amount } = attributes;

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	return (
		<div {...blockProps}>
			<ScCustomDonationAmount 
				currencyCode={currency}
			/>
		</div>
	);
};

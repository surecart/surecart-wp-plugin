/** @jsx jsx */
import { ScCustomDonationAmount } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/core';

export default ({ attributes, setAttributes }) => {
	const { currency } = attributes;

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			width: '100%',
		},
	});

	return (
		<div {...blockProps}>
			<ScCustomDonationAmount currencyCode={currency} />
		</div>
	);
};

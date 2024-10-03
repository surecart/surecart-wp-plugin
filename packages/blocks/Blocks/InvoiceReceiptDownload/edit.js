import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { ScLineItem } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	return (
		<ScLineItem>
			<RichText
				tagName="span"
				slot="description"
				placeholder={__('Receipt / Invoice', 'surecart')}
				value={text}
				onChange={(text) => setAttributes({ text })}
				allowedFormats={[]}
			/>
			<div
				slot="price-description"
				class="sc-invoice-download-link"
				style={{
					display: 'inline-flex',
					gap: 'var(--sc-spacing-x-small)',
					textDecoration: 'none',
					color: 'inherit',
				}}
			>
				<sc-icon name="download" />
				{__('Download', 'surecart')}
			</div>
		</ScLineItem>
	);
};

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
				placeholder={__('Invoice Number', 'surecart')}
				value={text}
				onChange={(text) => setAttributes({ text })}
				allowedFormats={[]}
			/>
			<span slot="price-description">#001</span>
		</ScLineItem>
	);
};

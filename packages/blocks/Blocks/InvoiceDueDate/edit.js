import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { ScFormatDate, ScLineItem } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	return (
		<ScLineItem>
			<RichText
				tagName="span"
				slot="description"
				placeholder={__('Due Date', 'surecart')}
				value={text}
				onChange={(text) => setAttributes({ text })}
				allowedFormats={[]}
			/>
			<ScFormatDate
				date={new Date().getTime() / 1000}
				type="timestamp"
				month="short"
				day="numeric"
				year="numeric"
				slot="price-description"
			/>
		</ScLineItem>
	);
};

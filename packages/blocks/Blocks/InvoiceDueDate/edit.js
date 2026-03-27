import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { ScLineItem } from '@surecart/components-react';
import { formatDate } from '../../../admin/util/time';

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
			{formatDate(Date().now())}
		</ScLineItem>
	);
};

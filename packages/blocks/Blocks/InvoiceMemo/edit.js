/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	return (
		<div>
			<RichText
				tagName="span"
				slot="description"
				placeholder={__('Memo', 'surecart')}
				value={text}
				onChange={(text) => setAttributes({ text })}
				allowedFormats={[]}
			/>

			<div>{__('Thank you for your business!', 'surecart')}</div>
		</div>
	);
};

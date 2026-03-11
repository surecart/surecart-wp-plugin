import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<div
				style={{
					fontSize: 'var(--sc-font-size-small)',
					lineHeight: 'var(--sc-line-height-dense)',
					color: 'var(--sc-input-label-color)',
					display: 'grid',
					gap: '5px',
				}}
			>
				<RichText
					tagName="span"
					slot="description"
					placeholder={__('Memo', 'surecart')}
					value={text}
					onChange={(text) => setAttributes({ text })}
					allowedFormats={[]}
				/>

				<div
					style={{
						textAlign: 'left',
						color: 'var(--sc-input-help-text-color)',
					}}
				>
					{__('Thank you for your business!', 'surecart')}
				</div>
			</div>
		</div>
	);
};

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	return (
		<div
			css={css`
				font-size: var(--sc-font-size-small);
				line-height: var(--sc-line-height-dense);
				color: var(--sc-input-label-color);
				display: grid;
				gap: 5px;
			`}
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
				css={css`
					text-align: left;
					color: var(--sc-input-help-text-color);
				`}
			>
				{__('Thank you for your business!', 'surecart')}
			</div>
		</div>
	);
};

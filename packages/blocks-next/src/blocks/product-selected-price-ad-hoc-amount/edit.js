import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	RichText,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps();
	const colorProps = useColorProps(attributes);

	return (
		<div {...blockProps}>
			<RichText
				tagName="label"
				className={`sc-form-label ${colorProps.className}`}
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={['core/bold', 'core/italic']}
			/>
			<div class="sc-input-group">
				<span class="sc-input-group-text" id="basic-addon1">
					{scData?.currency_symbol}
				</span>
				<input class="sc-form-control" type="number" step="0.01" />
			</div>
		</div>
	);
};

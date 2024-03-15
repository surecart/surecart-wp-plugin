import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { __unstableGetBlockProps } from '@wordpress/blocks/build/api';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	const blockProps = __unstableGetBlockProps({
		className: 'sc-choices',
	});

	<div {...blockProps}>
		<RichText
			tagName="label"
			className="sc-form-label"
			aria-label={__('Label text', 'surecart')}
			placeholder={__('Add label…', 'surecart')}
			value={label}
			onChange={(label) => setAttributes({ label })}
			withoutInteractiveFormatting
			allowedFormats={['core/bold', 'core/italic']}
		/>
		<div class="input-group">
			<span class="input-group-text">+</span>
			<input
				type="text"
				class="form-control"
				placeholder="Username"
				aria-label="Username"
				aria-describedby="basic-addon1"
			/>
			<span class="input-group-text">-</span>
		</div>
	</div>;
};

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { ScInput } from '@surecart/components-react';
import Inspector from './components/Inspector';

export default ({ attributes, setAttributes }) => {
	const { label, placeholder, help } = attributes;
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<Inspector attributes={attributes} setAttributes={setAttributes} />

			<ScInput
				type="email"
				label={label}
				placeholder={placeholder}
				help={help}
				required
			></ScInput>
		</div>
	);
};

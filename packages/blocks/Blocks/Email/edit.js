/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { ScInput } from '@surecart/components-react';
import Inspector from './components/Inspector';

export default ({ className, attributes, setAttributes }) => {
	const { label, placeholder, help } = attributes;

	return (
		<div className={className}>
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

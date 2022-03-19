/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { CeInput } from '@checkout-engine/components-react';
import Inspector from './components/Inspector';

export default ({ className, attributes, setAttributes }) => {
	const { label, placeholder, help } = attributes;

	return (
		<div className={className}>
			<Inspector attributes={attributes} setAttributes={setAttributes} />

			<CeInput
				type="email"
				label={label}
				placeholder={placeholder}
				help={help}
				required
			></CeInput>
		</div>
	);
};

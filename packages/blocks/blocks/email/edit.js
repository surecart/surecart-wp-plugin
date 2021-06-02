/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { PrestoInput } from '@checkout-engine/react';
import Inspector from './components/Inspector';

export default ( { className, attributes, setAttributes } ) => {
	const { label, placeholder } = attributes;

	return (
		<div className={ className }>
			<Inspector
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<PrestoInput
				type="email"
				label={ label }
				placeholder={ placeholder }
			></PrestoInput>
		</div>
	);
};

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { CeFormRow, CeInput } from '@checkout-engine/react';
import Inspector from './components/Inspector';

export default ( {
	className,
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) => {
	const {
		firstnameLabel,
		lastnameLabel,
		firstnameHelp,
		lastnameHelp,
	} = attributes;

	return (
		<CeFormRow>
			<Inspector
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<CeInput
				label={ firstnameLabel }
				name="firstname"
				help={ firstnameHelp }
			></CeInput>
			<CeInput
				label={ lastnameLabel }
				name="lastname"
				help={ lastnameHelp }
			></CeInput>
		</CeFormRow>
	);
};

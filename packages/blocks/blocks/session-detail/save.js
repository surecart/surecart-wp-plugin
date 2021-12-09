import { __ } from '@wordpress/i18n';

export default ( { attributes } ) => {
	const { value, label } = attributes;
	return (
		<ce-session-detail label={ label } value={ value }></ce-session-detail>
	);
};

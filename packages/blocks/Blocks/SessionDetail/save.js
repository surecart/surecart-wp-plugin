import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { value, label } = attributes;
	return <sc-session-detail label={label} value={value}></sc-session-detail>;
};

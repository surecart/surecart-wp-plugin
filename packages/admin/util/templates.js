import { __ } from '@wordpress/i18n';

export const getTemplateTitle = (template) => {
	// is default template. Are we customized or not?
	if (template?.theme === 'surecart/surecart') {
		return template?.wp_id
			? __('Default (Customized)', 'surecart')
			: __('Default', 'surecart');
	}
	return template?.title?.rendered || template?.slug;
};

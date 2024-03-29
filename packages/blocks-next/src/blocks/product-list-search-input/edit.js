import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'is-layout-flex sc-form-control',
		style: {
			height: 'auto',
		},
	});
	return <input {...blockProps} type="search" />;
};

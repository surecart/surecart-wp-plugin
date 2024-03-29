import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps({
		className: 'sc-form-control',
	});
	return <input {...blockProps} type="search" />;
};

import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default () => {
	const blockProps = useBlockProps();
	return <div {...blockProps}>{__('Subscribe & Save', 'surecart')}</div>;
};

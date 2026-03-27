import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	return <span {...blockProps}> {__('/ mo', 'surecart')} </span>;
};

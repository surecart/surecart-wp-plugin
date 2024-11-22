import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ context }) => {
	const blockProps = useBlockProps();
	const { name } = context['surecart/price'];
	return <div {...blockProps}>{name || __('Price Name', 'surecart')}</div>;
};

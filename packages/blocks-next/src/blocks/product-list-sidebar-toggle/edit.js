import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { menu } from '@wordpress/icons';

export default ({ attributes: { label } }) => {
	const blockProps = useBlockProps();

	return <Icon {...blockProps} icon={menu} />;
};

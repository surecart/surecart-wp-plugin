import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Icon from '../../components/Icon';

export default () => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<Icon name="menu" />
		</div>
	);
};

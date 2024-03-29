import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Icon, search } from '@wordpress/icons';

export default () => {
	const blockProps = useBlockProps({
		className: 'wp-element-button sc-input-group-text',
	});
	return (
		<button {...blockProps} type="submit">
			<Icon icon={search} />
		</button>
	);
};

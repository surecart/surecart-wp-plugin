import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	return (
		<p {...blockProps}>
			{__(
				'My First Interactive Block – hello from the editor!',
				'my-first-interactive-block'
			)}
		</p>
	);
};

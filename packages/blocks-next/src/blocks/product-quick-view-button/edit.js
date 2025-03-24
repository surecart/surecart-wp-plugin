/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ScIcon from '../../components/ScIcon';

export default ({
	attributes: { icon },
	setAttributes,
	context: { postId },
}) => {
	const blockProps = useBlockProps();

	return (
		<>
			<div {...blockProps}>
				<ScIcon name={icon} />
			</div>
		</>
	);
};

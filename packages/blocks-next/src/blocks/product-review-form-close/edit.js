/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default () => {
	const blockProps = useBlockProps({});
	return (
		<a {...blockProps}>
			<ScIcon name="x" />
		</a>
	);
};

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import ScIcon from '../../components/ScIcon';

import { __ } from '@wordpress/i18n';
export default () => {
	const blockProps = useBlockProps({});
	return (
		<a {...blockProps}>
			<ScIcon name="x" />
		</a>
	);
};

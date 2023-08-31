/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes: { align }, setAttributes }) => {
	const blockProps = useBlockProps({});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={align}
					onChange={(value) => setAttributes({ align: value })}
				/>
			</BlockControls>

			<figure class="wp-block-image sc-block-image">
				<img {...blockProps} src="https://placehold.co/900x100" />
			</figure>
		</>
	);
};

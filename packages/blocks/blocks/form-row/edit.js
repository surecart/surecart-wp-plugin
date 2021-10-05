/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeFormRow } from '@checkout-engine/react';
import { ALLOWED_BLOCKS } from '../../blocks';

export default ( { className, isSelected } ) => {
	return (
		<CeFormRow className={ className }>
			<InnerBlocks
				renderAppender={
					isSelected ? InnerBlocks.ButtonBlockAppender : false
				}
				allowedBlocks={ ALLOWED_BLOCKS }
			/>
		</CeFormRow>
	);
};

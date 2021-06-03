/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeInput } from '@checkout-engine/react';

export default ( { className } ) => {
	return (
		<div className={ className }>
			<CeInput></CeInput>
		</div>
	);
};

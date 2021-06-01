/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { PrestoInput } from '@checkout-engine/react/dist/index';

export default ( { className } ) => {
	return (
		<div className={ className }>
			<PrestoInput></PrestoInput>
		</div>
	);
};

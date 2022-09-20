/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Component Dependencies
 */
import { ScSecureNotice } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';

export default ( ) => {

	const blockProps = useBlockProps();

	return (
		<Fragment>
      <ScSecureNotice>
        {__('Honeypot field. This will not visible in the frontend', 'surecart')}
      </ScSecureNotice>
		</Fragment>
	);
};

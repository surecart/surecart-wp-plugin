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
        Its a honeypot trap for spammers. Will not visible in the frontend and work out of the box.
      </ScSecureNotice>
		</Fragment>
	);
};

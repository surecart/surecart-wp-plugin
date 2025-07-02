/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';

const ALLOWED_MEDIA_TYPES = ['image', 'video'];

export default ({ value, onSelect, ...rest }) => {
	return (
		<MediaUpload
			title={__('Select Media', 'surecart')}
			onSelect={onSelect}
			value={value}
			multiple={false}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			render={({ open }) => (
				<ScButton type="default" onClick={open}>
					<ScIcon name="upload" slot="prefix"></ScIcon>
					{__('Upload', 'surecart')}
				</ScButton>
			)}
			{...rest}
		/>
	);
};

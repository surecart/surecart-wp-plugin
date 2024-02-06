/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton } from '@surecart/components-react';

export default ({ license }) => {
	const onClick = () => {
		window.location.href = `admin.php?page=sc-licenses&action=edit&id=${license?.id}`;
	};

	return (
		<ScButton onClick={onClick} size="small">
			{__('View more', 'surecart')}
		</ScButton>
	);
};

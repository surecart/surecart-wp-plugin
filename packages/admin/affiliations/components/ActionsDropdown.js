/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({ affiliationRequest, onDelete, onApprove, onDeny }) => {
	if (!affiliationRequest?.id) {
		return '';
	}

	return (
		<ScDropdown slot="suffix" placement="bottom-end">
			<ScButton type="text" slot="trigger">
				<ScIcon name="more-horizontal" />
			</ScButton>
			<ScMenu>
				{['pending', 'denied'].includes(affiliationRequest?.status) && (
					<ScMenuItem onClick={onApprove}>
						<ScIcon
							slot="prefix"
							style={{ opacity: 0.5 }}
							name="check-circle"
						/>
						{__('Approve', 'surecart')}
					</ScMenuItem>
				)}

				{['pending', 'approved'].includes(
					affiliationRequest?.status
				) && (
					<ScMenuItem onClick={onDeny}>
						<ScIcon
							slot="prefix"
							style={{ opacity: 0.5 }}
							name="x-circle"
						/>
						{__('Reject', 'surecart')}
					</ScMenuItem>
				)}

				{!!onDelete && (
					<ScMenuItem onClick={onDelete}>
						<ScIcon
							slot="prefix"
							style={{ opacity: 0.5 }}
							name="trash"
						/>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				)}
			</ScMenu>
		</ScDropdown>
	);
};

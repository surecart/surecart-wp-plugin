import { ScButton, ScTooltip } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import ConfirmRevokeModal from '../../../subscriptions/show/modules/modals/ConfirmRevokeModal';

export default ({ purchase }) => {
	const [showConfirmRevoke, setShowConfirmRevoke] = useState(false);

	const toggleRevoke = () => {
		setShowConfirmRevoke(!showConfirmRevoke);
	};

	return (
		<>
			<ConfirmRevokeModal
				purchase={purchase}
				open={showConfirmRevoke}
				onRequestClose={toggleRevoke}
			/>
			<ScTooltip
				type="text"
				text={
					purchase?.revoked
						? __('Unrevoke access to this purchase', 'surecart')
						: __('Revoke access to this purchase', 'surecart')
				}
			>
				<ScButton onClick={toggleRevoke} size="small">
					{purchase?.revoked
						? __('Unrevoke', 'surecart')
						: __('Revoke', 'surecart')}
				</ScButton>
			</ScTooltip>
		</>
	);
};

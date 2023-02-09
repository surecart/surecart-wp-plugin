import { store as coreStore } from '@wordpress/core-data';
import { ScButton, ScTooltip } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
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
				text={__(
					purchase?.revoked
						? 'Unrevoke access to this purchase'
						: 'Revoke access to this purchase',
					'surecart'
				)}
			>
				<ScButton href="#" onClick={toggleRevoke} size="small">
					{__(purchase?.revoked ? 'Unrevoke' : 'Revoke', 'surecart')}
				</ScButton>
			</ScTooltip>
		</>
	);
};

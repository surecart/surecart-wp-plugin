/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({
	affiliationRequest,
	loading,
	onAffiliationRequestApprove,
	onAffiliationRequestDeny,
}) => {
	const confirmApprove = () =>
		confirm(__('Are you sure to approve affiliate request?', 'surecart'));

	const confirmDeny = () =>
		confirm(__('Are you sure to reject affiliate request?', 'surecart'));

	return (
		<>
			{['pending', 'denied'].includes(affiliationRequest?.status) && (
				<ScButton
					type="success"
					outline={true}
					onClick={() =>
						confirmApprove() && onAffiliationRequestApprove()
					}
					loading={loading}
				>
					<ScIcon slot="prefix" name="check-circle" />
					{__('Approve', 'surecart')}
				</ScButton>
			)}

			{['pending', 'approved'].includes(affiliationRequest?.status) && (
				<ScButton
					type="danger"
					outline={true}
					onClick={() => confirmDeny() && onAffiliationRequestDeny()}
					loading={loading}
				>
					<ScIcon slot="prefix" name="x-circle" />
					{__('Reject', 'surecart')}
				</ScButton>
			)}
		</>
	);
};

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
	return (
		<>
			{['pending', 'denied'].includes(affiliationRequest?.status) && (
				<ScButton
					type="primary"
					onClick={() =>
						confirm(
							__(
								'Are you sure to approve affiliate request?',
								'surecart'
							)
						) && onAffiliationRequestApprove()
					}
					loading={loading}
				>
					<ScIcon
						slot="prefix"
						style={{ opacity: 0.5 }}
						name="check-circle"
					/>
					{__('Approve', 'surecart')}
				</ScButton>
			)}

			{['pending', 'approved'].includes(affiliationRequest?.status) && (
				<ScButton
					type="danger"
					onClick={() =>
						confirm(
							__(
								'Are you sure to reject affiliate request?',
								'surecart'
							)
						) && onAffiliationRequestDeny()
					}
					loading={loading}
					outline={true}
				>
					<ScIcon
						slot="prefix"
						style={{ opacity: 0.5 }}
						name="x-circle"
					/>
					{__('Reject', 'surecart')}
				</ScButton>
			)}
		</>
	);
};

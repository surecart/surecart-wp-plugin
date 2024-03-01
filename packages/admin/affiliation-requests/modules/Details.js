/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	ScColumn,
	ScColumns,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import { css, jsx } from '@emotion/core';
import StatusBadge from '../../components/StatusBadge';

export default ({ affiliationRequest, updateAffiliationRequest, loading }) => {
	return (
		<Box
			title={__('Affiliate Request Details', 'surecart')}
			loading={loading}
			header_action={<StatusBadge status={affiliationRequest.status} />}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				<ScColumns>
					<ScColumn>
						<ScInput
							label={__('First Name', 'surecart')}
							className="sc-affiliate-request-fname"
							help={__(
								"Your affiliate request's first name.",
								'surecart'
							)}
							attribute="first_name"
							value={affiliationRequest?.first_name}
							onScInput={(e) =>
								updateAffiliationRequest({
									first_name: e.target.value,
								})
							}
						/>
					</ScColumn>
					<ScColumn>
						<ScInput
							label={__('Last Name', 'surecart')}
							className="sc-affiliate-request-lname"
							help={__(
								"Your affiliate request's last name.",
								'surecart'
							)}
							attribute="last_name"
							value={affiliationRequest?.last_name}
							onScInput={(e) =>
								updateAffiliationRequest({
									last_name: e.target.value,
								})
							}
						/>
					</ScColumn>
				</ScColumns>
				<ScColumns>
					<ScColumn>
						<ScInput
							label={__('Email', 'surecart')}
							className="sc-affiliate-request-email"
							help={__(
								"Your affiliate request's email address.",
								'surecart'
							)}
							value={affiliationRequest?.email}
							name="email"
							required
							onScInput={(e) =>
								updateAffiliationRequest({
									email: e.target.value,
								})
							}
						/>
					</ScColumn>
					<ScColumn>
						<ScInput
							label={__('Payout Email', 'surecart')}
							className="sc-affiliate-request-payout-email"
							help={__(
								"Your affiliate request's payout email address.",
								'surecart'
							)}
							value={affiliationRequest?.payout_email}
							name="payout_email"
							required
							onScInput={(e) =>
								updateAffiliationRequest({
									payout_email: e.target.value,
								})
							}
						/>
					</ScColumn>
				</ScColumns>
				<ScColumns>
					<ScColumn>
						<ScTextarea
							label={__('Bio', 'surecart')}
							help={__(
								'A short blurb from this affiliate describing how they will promote this store',
								'surecart'
							)}
							onScChange={(e) =>
								updateAffiliationRequest({
									bio: e.target.value,
								})
							}
							value={affiliationRequest?.bio}
							name="bio-text"
						/>
					</ScColumn>
				</ScColumns>
			</div>
		</Box>
	);
};

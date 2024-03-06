/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScColumn,
	ScColumns,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import StatusBadge from '../../components/StatusBadge';
import SaveButton from '../../templates/SaveButton';

export default ({
	affiliationRequest,
	updateAffiliationRequest,
	loading,
	saving,
	deleting,
}) => {
	const { status, first_name, last_name, email, payout_email, bio } =
		affiliationRequest;
	return (
		<Box
			title={__('Affiliate Request Details', 'surecart')}
			loading={loading}
			header_action={<StatusBadge status={status} />}
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
							value={first_name}
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
							value={last_name}
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
							value={email}
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
							value={payout_email}
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
							value={bio}
							name="bio-text"
						/>
					</ScColumn>
				</ScColumns>

				<div
					css={css`
						margin-top: var(--sc-spacing-medium);
					`}
				>
					<SaveButton busy={loading || saving || deleting}>
						{__('Save', 'surecart')}
					</SaveButton>
				</div>
			</div>
		</Box>
	);
};

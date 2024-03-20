/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScTextarea } from '@surecart/components-react';
import Box from '../../ui/Box';
import StatusBadge from '../../components/StatusBadge';
import SaveButton from '../../templates/SaveButton';

export default ({
	affiliationRequest,
	onUpdate,
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
			footer={
				<SaveButton busy={loading || saving || deleting}>
					{__('Save', 'surecart')}
				</SaveButton>
			}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					grid-template-columns: 1fr 1fr;
				`}
			>
				<ScInput
					label={__('First Name', 'surecart')}
					className="sc-affiliate-request-fname"
					help={__(
						"Your affiliate request's first name.",
						'surecart'
					)}
					value={first_name}
					onScInput={(e) =>
						onUpdate({
							first_name: e.target.value,
						})
					}
				/>

				<ScInput
					label={__('Last Name', 'surecart')}
					className="sc-affiliate-request-lname"
					help={__("Your affiliate request's last name.", 'surecart')}
					value={last_name}
					onScInput={(e) =>
						onUpdate({
							last_name: e.target.value,
						})
					}
				/>

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
						onUpdate({
							email: e.target.value,
						})
					}
				/>

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
						onUpdate({
							payout_email: e.target.value,
						})
					}
				/>

				<ScTextarea
					css={css`
						grid-column: 1 / 3;
					`}
					label={__('Bio', 'surecart')}
					help={__(
						'A short blurb from this affiliate describing how they will promote this store',
						'surecart'
					)}
					onScInput={(e) =>
						onUpdate({
							bio: e.target.value,
						})
					}
					value={bio}
					name="bio-text"
					required
				/>
			</div>
		</Box>
	);
};

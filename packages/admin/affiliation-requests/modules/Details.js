/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScTextarea, ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';
import SaveButton from '../../templates/SaveButton';

export default ({
	affiliationRequest,
	onUpdate,
	loading,
	saving,
	deleting,
	...props
}) => {
	const {
		status_type,
		status_display_text,
		first_name,
		last_name,
		email,
		payout_email,
		bio,
		url,
		metadata,
	} = affiliationRequest;

	return (
		<Box
			title={__('Affiliate Request Details', 'surecart')}
			loading={loading}
			header_action={
				<>
					<ScTag type={status_type}>{status_display_text}</ScTag>
					{!!metadata?.agency && (
						<ScTag type="info">
							{__('Agency Program', 'surecart')}
						</ScTag>
					)}
				</>
			}
			footer={
				<SaveButton busy={loading || saving || deleting}>
					{__('Save', 'surecart')}
				</SaveButton>
			}
			{...props}
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
					required
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
					type="email"
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
					type="email"
					required
					onScInput={(e) =>
						onUpdate({
							payout_email: e.target.value,
						})
					}
				/>

				<ScInput
					value={url}
					label={__('Website', 'surecart')}
					onScInput={(e) =>
						onUpdate({
							url: e.target.value,
						})
					}
					help={__(
						'The primary website or social media account of the affiliate.',
						'surecart'
					)}
					type="url"
				/>

				<ScTextarea
					css={css`
						grid-column: 1 / 3;
					`}
					label={__('Bio', 'surecart')}
					help={__(
						'A short blurb from this affiliate describing how they will promote this store.',
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

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScPriceInput, ScTextarea } from '@surecart/components-react';

export default ({ referral, updateReferral, loading }) => {
	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Referral Details', 'surecart')}
				</div>
			}
			loading={loading}
		>
			<ScPriceInput
				label={__('Commission Amount', 'surecart')}
				placeholder={__('Enter an Amount', 'surecart')}
				currencyCode={scData.currency_code}
				value={referral.commission_amount}
				onScInput={(e) => {
					updateReferral({
						commission_amount: e.target.value,
					});
				}}
				required
				disabled={!referral?.editable}
			/>

			<ScTextarea
				label={__('Description', 'surecart')}
				onScInput={(e) =>
					updateReferral({
						description: e.target.value,
					})
				}
				value={referral?.description}
				name="description"
				placeholder={__(
					'A brief description of what this referral is for.',
					'surecart'
				)}
				disabled={!referral?.editable}
			/>
		</Box>
	);
};

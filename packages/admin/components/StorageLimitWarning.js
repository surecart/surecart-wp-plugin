/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFormatBytes, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

/**
 *
 * @param {{ mediaUsageDetails: { count: number, limit: number }, mediaUsagePercentage: number }} props
 */

export default (props) => {
	const { mediaUsageDetails, mediaUsagePercentage } = props;

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: 0.44rem;
				@media screen and (min-width: 720px) {
					flex-direction: row;
					padding-left: 0.55rem;
					align-items: center;
					gap: 0.66rem;
				}
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.66rem;
					@media screen and (min-width: 720px) {
						padding-right: 0.33rem;
					}
				`}
			>
				<div
					css={css`
						background-color: #dddddd;
						border-radius: 6px;
						height: 6px;
						width: 3rem;
						@media screen and (min-width: 720px) {
							width: 5rem;
						}
					`}
				>
					<div
						css={css`
							background-color: var(--sc-color-warning-500);
							border-radius: 6px;
							height: 6px;
							width: ${mediaUsagePercentage}%;
						`}
					></div>
				</div>
				<div
					css={css`
						font-size: 0.75rem;
					`}
				>
					<ScFormatBytes
						style={{
							color: 'var(--sc-color-warning-500)',
							fontWeight: 600,
						}}
						value={mediaUsageDetails?.count}
					/>{' '}
					{__('of', 'surecart')}{' '}
					<ScFormatBytes
						style={{ color: 'var(--sc-color-gray-600)' }}
						value={mediaUsageDetails?.limit}
					/>
				</div>
			</div>

			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.66rem;
				`}
			>
				<ScTag
					type="warning"
					css={css`
						--sc-font-weight-bold: 400;
					`}
				>
					{__('Your storage space is low', 'surecart')}
				</ScTag>
				<ScButton
					target="_blank"
					href={scData?.upgrade_url || 'https://app.surecart.com'}
					size="small"
					type="warning"
				>
					{__('Upgrade', 'surecart')}
				</ScButton>
			</div>
		</div>
	);
};

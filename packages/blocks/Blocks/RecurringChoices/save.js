/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { label, amount, currency } = attributes;

	return (
		<>
			<div
				css={css`
					width: 100%;
					font-size: 1em;
					font-weight: 500;
				`}
			>
				{__('Make it recurring', 'surecart')}
			</div>
			<div
				css={css`
					width: 100%;
					display: flex;
					justify-content: space-between;
					gap: 2em;
				`}
			>
				<div
					css={css`
						width: 50%;`
					}
				>
					<sc-recurring-price-choice-container
						label={__('Yes, count me in!', 'surecart')}
						// prices={prices}
					/>
				</div>
				<div
					css={css`
						width: 50%;`
					}
				>

					<sc-choice
						showControl={false}
						checked={false}
						value="one-time"
						css={css`
							height: 100%;`
						}
					>
						{__('No, donate once', 'surecart')}
					</sc-choice>
				</div>
			</div>
		</>
	);
};

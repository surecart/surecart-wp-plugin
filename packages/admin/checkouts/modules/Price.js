/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { intervalString } from '../../util/translations';
import {
	ScButton,
	ScFlex,
	ScFormatNumber,
	ScInput,
	ScStackedListRow,
	ScIcon,
} from '@surecart/components-react';

export default ({ price, onRemove }) => {
	const imageUrl = price?.product?.image_url;

	return (
		<ScStackedListRow
			style={{
				'--columns': '3',
			}}
		>
			<ScFlex alignItems="center" justifyContent="flex-start">
				{imageUrl ? (
					<img
						src={imageUrl}
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: #f3f3f3;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(--sc-border-radius-small);
						`}
					/>
				) : (
					<div
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: var(--sc-color-gray-100);
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(--sc-border-radius-small);
						`}
					>
						<ScIcon
							style={{
								width: '18px',
								height: '18px',
							}}
							name={'image'}
						/>
					</div>
				)}
				<div>
					<div>
						<strong>{price?.product?.name}</strong>
					</div>
					<ScFormatNumber
						type="currency"
						currency={price?.currency || 'usd'}
						value={price?.amount}
					/>
					{intervalString(price)}
				</div>
			</ScFlex>
			<div
				style={{
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<ScInput
					css={css`
						width: 30%;
					`}
					required
					value={price?.quantity || 1}
					name="name"
				/>
			</div>
			<div>
				<ScButton size="small" onClick={onRemove}>
					{__('Remove', 'surecart')}
				</ScButton>
			</div>
		</ScStackedListRow>
	);
};

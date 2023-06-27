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
	ScTable,
	ScTableCell,
	ScTableRow,
} from '@surecart/components-react';

export default ({ price, onRemove, onQuantityChange }) => {
	const imageUrl = price?.product?.image_url;
	
	return (
		<ScTableRow>
			<ScTableCell>
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
			</ScTableCell>
			<ScTableCell>
				<ScInput
					required
					value={price?.quantity || 1}
					name="name"
					type="number"
					step="1"
					onScInput={onQuantityChange}
				/>
			</ScTableCell>
			<ScTableCell style={{ textAlign: 'center' }}>
				<ScFormatNumber
					type="currency"
					currency={price?.currency || 'usd'}
					value={price?.quantity ? price?.amount * price?.quantity : price?.amount}
				/>
			</ScTableCell>
			<ScTableCell>
				<ScButton size="small" onClick={onRemove}>
					{__('Remove', 'surecart')}
				</ScButton>
			</ScTableCell>
		</ScTableRow>
	);
};

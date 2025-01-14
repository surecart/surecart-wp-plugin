/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import { intervalString } from '../../../../util/translations';

export default ({ price, product, onRemove }) => {
	// TODO: Update for 3.0.
	const media = getFeaturedProductMediaAttributes(product);
	return (
		<ScStackedList>
			<ScCard noPadding>
				<ScStackedListRow>
					<ScFlex alignItems="center" justifyContent="flex-start">
						{media.url ? (
							<img
								// TODO: Update for 3.0.
								src={media.url}
								alt={media.alt}
								{...(media.title ? { title: media.title } : {})}
								css={css`
									width: 40px;
									height: 40px;
									object-fit: cover;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									border-radius: var(
										--sc-border-radius-small
									);
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
									border-radius: var(
										--sc-border-radius-small
									);
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
								<strong>{product?.name}</strong>
							</div>
							<div>{price?.name}</div>
							{/* TODO: Update for 3.0 */}
							<ScFormatNumber
								value={price?.amount}
								type="currency"
								currency={price?.currency}
							/>
							{intervalString(price)}
						</div>
					</ScFlex>
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton type="text" slot="trigger" circle>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={() => onRemove()}>
								<ScIcon slot="prefix" name="trash" />
								{__('Remove', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</ScStackedListRow>
			</ScCard>
		</ScStackedList>
	);
};

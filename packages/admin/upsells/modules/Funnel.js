/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import EditUpsell from './EditUpsell';
import { useState } from '@wordpress/element';
import FilterItem from '../../components/filters/FilterItem';
import LineItemLabel from '../../ui/LineItemLabel';
import { intervalString } from '../../util/translations';

export default ({ upsell, loading }) => {
	const [editUpsell, setEditUpsell] = useState(false);

	return (
		<>
			<Box
				title={__('Post Purchase Offer', 'surecart')}
				loading={loading}
			>
				<ScCard
					css={css`
						z-index: 2;
					`}
					noPadding
				>
					<FilterItem
						loading={loading}
						media={
							upsell?.price?.product?.featured_product_media
								?.media
						}
						icon={'image'}
						onRemove={() => {}}
						suffix={
							<div
								css={css`
									align-self: center;
								`}
							>
								<ScButton onClick={() => setEditUpsell(true)}>
									<ScIcon name="edit-3" slot="prefix" />
									{__('Edit Offer', 'surecart')}
								</ScButton>
								<ScDropdown
									slot="suffix"
									placement="bottom-end"
								>
									<ScButton type="text" slot="trigger" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem>
											<ScIcon
												slot="prefix"
												name="trash"
											/>
											{__('Remove', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
							</div>
						}
					>
						<div>
							<div>
								<strong>{upsell?.price?.product?.name}</strong>
							</div>
							<LineItemLabel lineItem={{ price: upsell?.price }}>
								<ScFormatNumber
									type="currency"
									currency={upsell?.price?.currency || 'usd'}
									value={upsell?.price?.amount}
								/>
								{intervalString(upsell?.price)}
							</LineItemLabel>
						</div>
					</FilterItem>
				</ScCard>
				<div
					css={css`
						display: flex;
						flex-wrap: wrap;
						gap: 1em;
					`}
				>
					<ScCard
						css={css`
							flex: 1;
							position: relative;
							min-width: 100px;
							margin-top: 60px;
							z-index: 1;
							&:before {
								content: ' ';
								position: absolute;
								left: 50%;
								top: -120px; /* Adjust this value to position the line above the div */
								height: 120px; /* Height of the vertical line */
								width: 1px; /* Width of the vertical line */
								background-color: rgba(
									0,
									0,
									0,
									0.2
								); /* Color of the line */
								transform: translateX(-50%);
								z-index: 0;
							}
							&:after {
								content: '${__('if accepted', 'surecart')}';
								position: absolute;
								left: 50%;
								top: -56px; /* Adjust this value to position the line above the div */
								transform: translateX(-50%);
								border: 1px solid var(--sc-color-success-600);
								color: var(--sc-color-success-600);
								padding: 10px;
								background: white;
								z-index: 0;
								line-height: 1;
								font-size: 12px;
								border-radius: 6px;
							}
						`}
					>
						<ScButton onClick={() => setEditUpsell(true)}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Product', 'surecart')}
						</ScButton>
					</ScCard>
					<ScCard
						css={css`
							flex: 1;
							position: relative;
							min-width: 100px;
							margin-top: 60px;
							&:before {
								content: ' ';
								position: absolute;
								left: 50%;
								top: -120px; /* Adjust this value to position the line above the div */
								height: 120px; /* Height of the vertical line */
								width: 1px; /* Width of the vertical line */
								background-color: rgba(
									0,
									0,
									0,
									0.2
								); /* Color of the line */
								transform: translateX(-50%);
								z-index: 0;
							}
							&:after {
								content: '${__('if declined', 'surecart')}';
								position: absolute;
								left: 50%;
								top: -56px; /* Adjust this value to position the line above the div */
								transform: translateX(-50%);
								border: 1px solid var(--sc-color-danger-500);
								color: var(--sc-color-danger-500);
								padding: 10px;
								background: white;
								z-index: 0;
								line-height: 1;
								font-size: 12px;
								border-radius: 6px;
							}
						`}
					>
						<ScButton onClick={() => setEditUpsell(true)}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Product', 'surecart')}
						</ScButton>
					</ScCard>
				</div>
			</Box>
			<EditUpsell
				open={editUpsell}
				upsell={editUpsell}
				onRequestClose={() => setEditUpsell(false)}
			/>
		</>
	);
};

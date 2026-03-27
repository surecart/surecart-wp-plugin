/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScEmpty,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import FilterItem from '../../../components/filters/FilterItem';
import LineItemLabel from '../../../ui/LineItemLabel';
import { intervalString } from '../../../util/translations';
import { getHumanDiscount } from '../../../util';

const OFFER_TITLE = {
	initial: __('Initial Offer', 'surecart'),
	accepted: __('Accept Offer', 'surecart'),
	declined: __('Decline Offer', 'surecart'),
};

export default ({
	upsell,
	label,
	icon,
	loading,
	onEdit,
	onDelete,
	className,
}) => {
	const discount = getHumanDiscount(upsell, upsell?.price?.currency);

	const outOfStock =
		upsell?.price?.product?.stock_enabled &&
		upsell?.price?.product?.available_stock <= 0 &&
		!upsell?.price?.product?.allow_out_of_stock_purchases;

	if (!upsell) {
		return (
			<>
				<ScCard className={className}>
					<ScEmpty icon={icon}>
						{label}
						<div>
							<ScButton onClick={onEdit}>
								<ScIcon name="plus" slot="prefix" />
								{__('Add Product', 'surecart')}
							</ScButton>
						</div>
					</ScEmpty>
				</ScCard>
			</>
		);
	}

	return (
		<ScCard
			css={css`
				::part(base) {
					height: 100%;
				}
			`}
			className={className}
			noPadding
		>
			<FilterItem
				media={upsell?.price?.product?.featured_product_media?.media}
				icon={'image'}
				onDelete={onDelete}
				loading={loading}
				suffix={
					<div
						slot="suffix"
						css={css`
							align-self: center;
						`}
					>
						<ScDropdown placement="bottom-end">
							<ScButton type="text" circle slot="trigger">
								<ScIcon name="more-horizontal" />
							</ScButton>

							<ScMenu>
								<ScMenuItem onClick={onEdit}>
									<ScIcon name="edit-3" slot="prefix" />
									{__('Edit offer', 'surecart')}
								</ScMenuItem>

								<ScMenuItem
									href={upsell?.permalink}
									target="_blank"
								>
									<ScIcon
										name="external-link"
										slot="prefix"
									/>
									{__('Preview upsell', 'surecart')}
								</ScMenuItem>

								<ScMenuDivider />

								<ScMenuItem
									type="text"
									circle
									onClick={onDelete}
								>
									<ScIcon name="trash" slot="prefix" />
									{__('Delete offer', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					</div>
				}
			>
				<div
					css={css`
						display: grid;
						gap: 0.25em;
						margin-right: 0.5em;
					`}
				>
					{!!discount && (
						<div>
							<ScTag size="small" type="success" pill>
								{discount}
							</ScTag>
						</div>
					)}
					{outOfStock && (
						<div>
							<ScTag size="small" type="warning" pill>
								{__('Out Of Stock', 'surecart')}
							</ScTag>
						</div>
					)}
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
	);
};

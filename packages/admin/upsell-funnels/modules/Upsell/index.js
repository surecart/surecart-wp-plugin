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
	ScMenuDivider,
	ScMenuItem,
} from '@surecart/components-react';
import SelectTemplate from '../../components/SelectTemplate';
import SelectTemplatePart from '../../components/SelectTemplatePart';
import FilterItem from '../../../components/filters/FilterItem';
import LineItemLabel from '../../../ui/LineItemLabel';
import { intervalString } from '../../../util/translations';
import { useState } from '@wordpress/element';

export default ({ upsell, onEdit, onDelete, className }) => {
	const [modal, setModal] = useState(false);

	if (!upsell) {
		return (
			<>
				<ScCard className={className}>
					<ScButton onClick={onEdit}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Product', 'surecart')}
					</ScButton>
				</ScCard>
			</>
		);
	}

	const SelectUpsellTemplate = scData?.is_block_theme
		? SelectTemplate
		: SelectTemplatePart;

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

								<SelectUpsellTemplate
									upsell={upsell}
									updateUpsell={onEdit}
									renderToggle={({ onToggle }) => (
										<ScMenuItem
											onClick={onToggle}
											slot="prefix"
										>
											<ScIcon
												name="layout"
												slot="prefix"
											/>
											{__('Edit template', 'surecart')}
										</ScMenuItem>
									)}
								/>

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
	);
};

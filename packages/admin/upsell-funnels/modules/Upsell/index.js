/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScFormatNumber,
	ScIcon,
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
		<ScCard className={className} noPadding>
			<FilterItem
				media={upsell?.price?.product?.featured_product_media?.media}
				icon={'image'}
				onDelete={onDelete}
				suffix={
					<div
						css={css`
							align-self: center;
						`}
					>
						<ScButton type="text" circle onClick={onEdit}>
							<ScIcon name="edit-3" />
						</ScButton>

						<SelectUpsellTemplate
							upsell={upsell}
							updateUpsell={onEdit}
							renderToggle={({ onToggle }) => (
								<ScButton type="text" circle onClick={onToggle}>
									<ScIcon name="layout" />
								</ScButton>
							)}
						/>

						<ScButton type="text" circle onClick={onDelete}>
							<ScIcon name="trash" />
						</ScButton>
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

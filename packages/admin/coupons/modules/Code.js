/** @jsx jsx */

import { __ } from '@wordpress/i18n';

import {
	CeInput,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
	CeTag,
} from '@checkout-engine/components-react';
import { Icon, box, trash, moreHorizontalMobile } from '@wordpress/icons';
import { css, jsx } from '@emotion/core';
import useEntity from '../../mixins/useEntity';
import { useState } from 'react';

export default ({ promotion: promotionEntity, index }) => {
	const { promotion, savePromotion, updatePromotion, deletePromotion } =
		useEntity('promotion', promotionEntity?.id, index);
	const [loading, setLoading] = useState(false);

	// archive.
	const onArchive = async () => {
		updatePromotion({
			archived: !promotion.archived,
		});
		try {
			setLoading(true);
			await savePromotion();
		} finally {
			setLoading(false);
		}
	};

	// delete promotion
	const onDelete = async () => {
		try {
			setLoading(true);
			await deletePromotion();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				gap: 1em;
			`}
		>
			<div
				css={css`
					flex: 1;
					display: flex;
					gap: 1em;
				`}
			>
				<CeInput
					className="ce-promotion-code"
					css={css`
						flex: 1;
					`}
					help={
						promotion?.id
							? __(
									'Customers will enter this discount code at checkout.',
									'checkout_engine'
							  )
							: __(
									'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
									'checkout_engine'
							  )
					}
					attribute="name"
					value={promotion?.code}
					onCeChange={(e) =>
						updatePromotion({ code: e.target.value })
					}
				>
					{promotion?.archived && (
						<CeTag type="warning" slot="suffix">
							{__('Archived', 'checkout_engine')}
						</CeTag>
					)}
				</CeInput>
			</div>
			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" loading={loading} circle>
					<Icon icon={moreHorizontalMobile} />
				</CeButton>
				<CeMenu>
					{promotion?.id && (
						<CeMenuItem onClick={() => onArchive(index)}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{promotion?.archived
								? __('Un-Archive', 'checkout_engine')
								: __('Archive', 'checkout_engine')}
						</CeMenuItem>
					)}
					<CeMenuItem onClick={() => onDelete(index)}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={trash}
							size={20}
						/>
						{__('Delete', 'checkout_engine')}
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		</div>
	);
};

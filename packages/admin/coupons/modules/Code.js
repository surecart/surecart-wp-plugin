/** @jsx jsx */

import { __ } from '@wordpress/i18n';

import {
	ScInput,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
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
			const r = confirm(
				__(
					'Are you sure you want to delete this promotion code?',
					'surecart'
				)
			);
			if (!r) return;
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
				<ScInput
					className="sc-promotion-code"
					css={css`
						flex: 1;
					`}
					help={
						promotion?.id
							? __(
									'Customers will enter this discount code at checkout.',
									'surecart'
							  )
							: __(
									'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
									'surecart'
							  )
					}
					attribute="name"
					value={promotion?.code}
					onScChange={(e) =>
						updatePromotion({ code: e.target.value })
					}
				>
					{promotion?.archived && (
						<ScTag type="warning" slot="suffix">
							{__('Archived', 'surecart')}
						</ScTag>
					)}
				</ScInput>
			</div>
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" loading={loading} circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					{promotion?.id && (
						<ScMenuItem onClick={() => onArchive(index)}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{promotion?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>
					)}
					<ScMenuItem onClick={() => onDelete(index)}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={trash}
							size={20}
						/>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</div>
	);
};

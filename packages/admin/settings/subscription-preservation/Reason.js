/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default ({ reason: passedReason, loading }) => {
	const reason = useSelect((select) =>
		select(coreStore).getEditedEntityRecord(
			'surecart',
			'cancellation_reason',
			passedReason?.id
		)
	);
	return (
		<ScStackedListRow
			style={{
				'--columns': '2',
			}}
		>
			{loading ? (
				<ScSkeleton style={{ width: '150px' }} />
			) : (
				<div>
					<strong>{reason?.label}</strong> {reason.position}
					{reason?.coupon_enabled && (
						<ScTag type="info" size="small">
							{__('Discount Offer', 'surecart')}
						</ScTag>
					)}
				</div>
			)}

			<ScIcon
				name="menu"
				slot="prefix"
				css={css`
					color: var(--sc-color-gray-400);
					cursor: move;
				`}
			/>

			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem>{__('Edit', 'surecart')}</ScMenuItem>
					<ScMenuItem>{__('Delete', 'surecart')}</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</ScStackedListRow>
	);
};

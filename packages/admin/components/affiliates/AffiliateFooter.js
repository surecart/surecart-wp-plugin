/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';
import UpdateExpireAtModal from './UpdateExpireAtModal';
import { formatDate } from '../../util/time';

export default ({ item, updateItem, commissionText }) => {
	const [modal, setModal] = useState(false);

	return (
		<>
			<ScFlex
				css={css`
					width: 100%;
				`}
				alignItems="center"
			>
				<div>
					<ScText
						css={css`
							font-weight: 600;
						`}
					>
						{commissionText}
					</ScText>
					{!item?.affiliation_expires_at ? (
						<ScText
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{__('Forever', 'surecart')}
						</ScText>
					) : (
						<span
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{__('Until', 'surecart')}{' '}
							{formatDate(item?.affiliation_expires_at * 1000)}
						</span>
					)}
				</div>

				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => setModal(true)}>
							<ScIcon
								slot="prefix"
								style={{ opacity: 0.5 }}
								name="calendar"
							/>
							{__('Update', 'surecart')}
						</ScMenuItem>
						{item?.affiliation_expires_at && (
							<ScMenuItem
								onClick={() =>
									updateItem({
										affiliation_expires_at: null,
									})
								}
							>
								<ScIcon
									slot="prefix"
									style={{ opacity: 0.5 }}
									name="x-square"
								></ScIcon>
								{__('Remove Limit', 'surecart')}
							</ScMenuItem>
						)}
					</ScMenu>
				</ScDropdown>
			</ScFlex>

			<UpdateExpireAtModal
				open={modal}
				onRequestClose={() => setModal(false)}
				item={item}
				updateItem={updateItem}
			/>
		</>
	);
};

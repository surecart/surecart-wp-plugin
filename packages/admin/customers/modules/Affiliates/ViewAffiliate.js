/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScAvatar,
	ScButton,
	ScDivider,
	ScDropdown,
	ScFlex,
	ScFormatDate,
	// ScFormatDate,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';
import useAvatar from '../../../hooks/useAvatar';
import UpdateExpireAtModal from './UpdateExpireAtModal';

export default ({ customer, affiliation, updateCustomer }) => {
	const [modal, setModal] = useState(false);
	const avatarUrl = useAvatar({ email: affiliation?.email });

	return (
		<div>
			<ScFlex>
				<ScFlex>
					<div>
						<ScAvatar
							image={avatarUrl}
							initials={
								affiliation?.first_name.charAt(0) +
								affiliation?.last_name.charAt(0)
							}
						/>
					</div>

					<div>
						<a
							href={addQueryArgs('admin.php', {
								page: 'sc-affiliates',
								action: 'edit',
								id: affiliation?.id,
							})}
						>
							{affiliation?.first_name +
								' ' +
								affiliation?.last_name}
						</a>
						<ScText
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{affiliation?.email}
						</ScText>
					</div>
				</ScFlex>

				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem
							onClick={() => {
								updateCustomer({
									affiliation: null,
								});
							}}
						>
							<ScIcon
								slot="prefix"
								style={{ opacity: 0.5 }}
								name="x-square"
							></ScIcon>
							{__('Remove', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScFlex>
			<ScDivider style={{ '--spacing': 'var(--sc-spacing-medium)' }} />
			<ScFlex>
				<div>
					<ScText
						css={css`
							font-weight: 600;
							margin-bottom: var(--sc-spacing-x-small);
						`}
					>
						{__('Commissions On All Purchases', 'surecart')}
					</ScText>
					{!customer?.affiliation_expires_at ? (
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
							<ScFormatDate
								type="timestamp"
								date={customer?.affiliation_expires_at}
								month="short"
								day="numeric"
								year="numeric"
							/>
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
							></ScIcon>
							{__('Update', 'surecart')}
						</ScMenuItem>
						{customer?.affiliation_expires_at && (
							<ScMenuItem
								onClick={() =>
									updateCustomer({
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
				customer={customer}
				updateCustomer={updateCustomer}
			/>
		</div>
	);
};

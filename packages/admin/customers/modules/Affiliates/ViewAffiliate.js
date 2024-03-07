/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDivider,
	ScDropdown,
	ScFlex,
	ScFormatDate,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScText,
} from '@surecart/components-react';

export default ({ customer, updateCustomer }) => {
	const { affiliation } = customer;

	return (
		<div>
			<ScFlex>
				<ScFlex>
					<div
						css={css`
							background: var(--sc-color-gray-100);
							border-radius: 50%;
							width: 40px;
							height: 40px;
							justify-content: center;
							align-items: center;
							display: flex;
						`}
					>
						<ScIcon name="user" />
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
						<ScMenuItem onClick={() => {}}>
							<ScIcon
								slot="prefix"
								style={{ opacity: 0.5 }}
								name="trash"
							></ScIcon>
							{__('Delete', 'surecart')}
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
					{!affiliation?.affiliation_expires_at ? (
						<ScText
							css={css`
								color: var(--sc-color-gray-500);
							`}
						>
							{__('Forever', 'surecart')}
						</ScText>
					) : (
						<ScFormatDate
							type="timestamp"
							date={affiliation?.affiliation_expires_at}
							month="short"
							day="numeric"
							year="numeric"
							hour="numeric"
							minute="numeric"
						/>
					)}
				</div>

				<ScDropdown placement="bottom-end">
					<ScButton type="text" slot="trigger">
						<ScIcon name="more-horizontal" />
					</ScButton>
					<ScMenu>
						<ScMenuItem onClick={() => {}}>
							<ScIcon
								slot="prefix"
								style={{ opacity: 0.5 }}
								name="calendar"
							></ScIcon>
							{__('Update', 'surecart')}
						</ScMenuItem>
					</ScMenu>
				</ScDropdown>
			</ScFlex>
		</div>
	);
};

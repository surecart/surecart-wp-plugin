/** @jsx jsx */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { ScButton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Definition from '../../../ui/Definition';
import { css, jsx } from '@emotion/core';

export default ({ userId, onDisconnect }) => {
	// fetch user when userId is selected.
	const user = useSelect(
		(select) =>
			select(coreStore).getEditedEntityRecord('root', 'user', userId),
		[userId]
	);

	if (!user) {
		return;
	}

	return (
		<Definition
			title={
				<div>
					{user?.avatar_urls?.[96] && (
						<img
							css={css`
								width: 48px;
								height: 48px;
								border-radius: 9999px;
							`}
							src={user?.avatar_urls?.[96]}
						/>
					)}
					<div>
						<a
							href={addQueryArgs('user-edit.php', {
								user_id: user?.id,
							})}
						>
							{user?.name || user?.email}
						</a>
					</div>
					{user?.name && user?.email && (
						<div
							css={css`
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								max-width: 235px;
							`}
						>
							{user?.email}
						</div>
					)}
				</div>
			}
		>
			<ScButton
				href=""
				size="small"
				type="danger"
				outline
				onClick={onDisconnect}
			>
				{__('Disconnect', 'surecart')}
			</ScButton>
		</Definition>
	);
};

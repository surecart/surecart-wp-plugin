/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScButton, ScLineItem } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import useAvatar from '../../hooks/useAvatar';

export default ({ customer, loading }) => {
	const imgUrl = useAvatar({ email: customer?.email });

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				<div>
					<ScButton
						size="small"
						href={addQueryArgs('admin.php', {
							page: 'sc-customers',
							action: 'edit',
							id: customer?.id,
						})}
					>
						{__('View Customer', 'surecart')}
					</ScButton>
				</div>
			}
		>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<ScLineItem>
					<img
						src={imgUrl}
						slot="image"
						css={css`
							width: 40px;
							height: 40px;
							border-radius: var(--sc-border-radius-medium);
						`}
					/>
					<span slot="title">{customer?.name}</span>
					<span slot="description">{customer?.email}</span>
				</ScLineItem>
			</div>
		</Box>
	);
};

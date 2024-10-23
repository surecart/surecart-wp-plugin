/** @jsx jsx */
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScButton, ScIcon, ScLineItem } from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import EditContactInfo from './EditContactInfo';

export default ({ checkout, loading, onManuallyRefetchOrder }) => {
	const customer = checkout?.customer;
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Box
				title={__('Contact Information', 'surecart')}
				loading={loading}
				header_action={
					<ScButton
						circle
						type="text"
						css={css`
							margin: -12px 0px;
						`}
						onClick={() => setIsEditing(true)}
					>
						<ScIcon name="edit-2" />
					</ScButton>
				}
			>
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<ScLineItem>
						<span slot="title">{checkout?.name}</span>
						<div slot="description">{checkout?.email}</div>
						<div slot="description">{checkout?.phone}</div>
					</ScLineItem>

					<ScLineItem>
						<span slot="title">{__('Customer', 'surecart')}</span>
						<a
							href={addQueryArgs('admin.php', {
								page: 'sc-customers',
								action: 'edit',
								id: customer?.id,
							})}
							slot="description"
						>
							{customer?.name || customer?.email}
						</a>
					</ScLineItem>
				</div>
			</Box>
			{isEditing && (
				<EditContactInfo
					checkout={checkout}
					onRequestClose={() => setIsEditing(false)}
					onManuallyRefetchOrder={onManuallyRefetchOrder}
				/>
			)}
		</>
	);
};

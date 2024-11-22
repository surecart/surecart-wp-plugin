/** @jsx jsx */
import Box from '../../../ui/Box';
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScLineItem,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
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
					<ScDropdown placement="bottom-end">
						<ScButton
							circle
							type="text"
							style={{
								'--button-color': 'var(--sc-color-gray-600)',
								margin: '-10px',
							}}
							slot="trigger"
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={() => setIsEditing(true)}>
								<ScIcon
									slot="prefix"
									name="edit"
									style={{
										opacity: 0.5,
									}}
								/>
								{__('Edit', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
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

			<EditContactInfo
				open={isEditing}
				onRequestClose={() => setIsEditing(false)}
				checkout={checkout}
				onManuallyRefetchOrder={onManuallyRefetchOrder}
			/>
		</>
	);
};

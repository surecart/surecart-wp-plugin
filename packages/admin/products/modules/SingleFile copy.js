/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import useFileUpload from '../../mixins/useFileUpload';
import { css, jsx } from '@emotion/core';
import useCurrentPage from '../../mixins/useCurrentPage';

export default ({ file, onUploaded, onRemove, onDisable, onEnable }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [id, setId] = useState('');
	const uploadFile = useFileUpload();
	const { setSaving } = useCurrentPage('product');

	if (!!error) {
		return (
			<sc-alert open={!!error} type="danger">
				{error}
			</sc-alert>
		);
	}

	return (
		<sc-stacked-list-row style={{ position: 'relative' }} mobile-size={0}>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.75em;
					overflow: hidden;
					min-width: 0;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 1em;
						background: var(--sc-color-gray-200);
						border-radius: var(--sc-border-radius-small);
					`}
				>
					{file?.name?.split?.('.')?.pop?.()}
					{file?.filename?.split?.('.')?.pop?.()}
				</div>
				<div
					css={css`
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					`}
				>
					<div
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						{file.name || file.filename}
					</div>
					<sc-format-bytes
						value={file.size || file.byte_size}
					></sc-format-bytes>
				</div>
			</div>

			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={onEnable}>
						{__('Enable', 'surecart')}
					</ScMenuItem>
				</ScMenu>
				<ScMenu>
					<ScMenuItem onClick={onDisable}>
						{__('Disable', 'surecart')}
					</ScMenuItem>
				</ScMenu>
				<ScMenu>
					<ScMenuItem onClick={onRemove}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</sc-stacked-list-row>
	);
};

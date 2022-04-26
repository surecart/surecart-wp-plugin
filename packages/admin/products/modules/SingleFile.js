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

export default ({ file, onUploaded, onRemoved }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [id, setId] = useState('');
	const uploadFile = useFileUpload();
	const { setSaving } = useCurrentPage('product');

	useEffect(() => {
		if (!file.id) {
			doUpload();
		}
	}, []);

	const doUpload = async () => {
		if (file.id) return;
		try {
			setLoading(true);
			setSaving(true);
			setError('');
			const id = await uploadFile(file);
			setId(id);
			onUploaded(id);
		} catch (e) {
			setError(
				__(
					'There was a problem with the upload. Please try again.',
					'surecart'
				)
			);
			console.error(e);
		} finally {
			setLoading(false);
			setSaving(false);
		}
	};

	const onRemove = async () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this file? This cannot be undone.',
				'surecart'
			)
		);
		if (!r) return;
		try {
			setLoading(true);
			// first get the unique upload id.
			if (file.id) {
				await apiFetch({
					method: 'DELETE',
					path: `/surecart/v1/files/${file.id}`,
				});
			}
			onRemoved({
				file,
				upload_id: id,
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	if (!!error) {
		return (
			<sc-alert open={!!error} type="danger">
				{error}
			</sc-alert>
		);
	}

	return (
		<sc-stacked-list-row style={{ position: 'relative' }} mobile-size={0}>
			{loading && <sc-block-ui spinner></sc-block-ui>}
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

			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={onRemove}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</sc-stacked-list-row>
	);
};

/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import {
	CeButton,
	CeDropdown,
	CeIcon,
	CeMenu,
	CeMenuItem,
} from '@surecart/components-react';
import { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import useFileUpload from '../../mixins/useFileUpload';
import { css, jsx } from '@emotion/core';
import useCurrentPage from '../../mixins/useCurrentPage';

export default ({ file, onUploaded, onRemoved }) => {
	const [loading, setLoading] = useState(false);
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
			const id = await uploadFile(file);
			setId(id);
			onUploaded(id);
		} catch (e) {
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

	return (
		<ce-stacked-list-row style={{ position: 'relative' }} mobile-size={0}>
			{loading && <ce-block-ui spinner></ce-block-ui>}
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
						background: var(--ce-color-gray-200);
						border-radius: var(--ce-border-radius-small);
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
					<ce-format-bytes
						value={file.size || file.byte_size}
					></ce-format-bytes>
				</div>
			</div>

			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<CeIcon name="more-horizontal" />
				</CeButton>
				<CeMenu>
					<CeMenuItem onClick={onRemove}>
						{__('Delete', 'surecart')}
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		</ce-stacked-list-row>
	);
};

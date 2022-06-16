/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { ScButton, ScFormControl } from '@surecart/components-react';
import { useState, useEffect } from '@wordpress/element';
import {
	FormFileUpload,
	DropZone,
	Spinner,
	Button,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import useFileUpload from '../../mixins/useFileUpload';

export default ({ brand, editBrand, loading }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const uploadFile = useFileUpload();
	const [src, setSrc] = useState('');

	useEffect(() => {
		if (brand?.logo_url) {
			setSrc(brand.logo_url);
		}
	}, [brand?.logo_url]);

	const onRemove = async () => {
		const r = confirm(
			__('Are you sure you want to remove this logo?', 'surecart')
		);
		if (!r) return;
		try {
			setBusy(true);
			await apiFetch({
				method: 'DELETE',
				path: `/surecart/v1/brand/purge_logo`,
			});
			editBrand({
				logo_url: '',
				logo_upload_id: null,
			});
			setSrc('');
		} catch (e) {
			console.log(e);
		} finally {
			setBusy(false);
		}
	};

	const uploadImage = async (e) => {
		// set uploads from file input.
		const files = [...(e?.currentTarget?.files || e)];
		const file = files[0];

		// set the preview in the browser.
		try {
			setSrc(URL.createObjectURL(file));
		} catch (e) {
			console.error(e);
			setError(
				__(
					'There was a problem with the upload. Please try again.',
					'surecart'
				)
			);
			return;
		}

		if (!file) return;

		try {
			setBusy(true);
			setError('');
			const id = await uploadFile(file);
			editBrand({ logo_upload_id: id });
		} catch (e) {
			console.error(e);
			setSrc('');
			setError(
				__(
					'There was a problem with the upload. Please try again.',
					'surecart'
				)
			);
		} finally {
			setBusy(false);
		}
	};

	const renderContent = () => {
		if (busy || loading) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				>
					<Spinner />
				</div>
			);
		}

		if (src) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={src}
						alt="logo"
						css={css`
							width: 100%;
							height: 100%;
							max-height: 8rem;
							object-fit: contain;
							height: auto;
							display: block;
							border-radius: var(--sc-border-radius-medium);
							background: #f3f3f3;
						`}
						onLoad={() => URL.revokeObjectURL(src)}
					/>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<FormFileUpload
							isSecondary
							accept="image/*"
							onChange={uploadImage}
							render={({ openFileDialog }) => {
								return (
									<ScButton
										type="primary"
										outline
										onClick={openFileDialog}
									>
										{__('Replace', 'surecart')}
									</ScButton>
								);
							}}
						>
							{__('Replace', 'surecart')}
						</FormFileUpload>
						<ScButton type="text" onClick={onRemove}>
							{__('Remove', 'surecart')}
						</ScButton>
					</div>
				</div>
			);
		}

		return (
			<div
				css={css`
					position: relative;
					border: 2px dashed var(--sc-color-gray-200);
					border-radius: var(--sc-border-radius-small);
					padding: 2em;
					display: grid;
					gap: 1em;
					text-align: center;
				`}
			>
				{__('Drag and drop an logo here', 'surecart')}
				<sc-divider>{__('Or', 'surecart')}</sc-divider>
				<FormFileUpload
					isPrimary
					accept="image/*"
					onChange={uploadImage}
					render={({ openFileDialog }) => {
						return (
							<ScButton
								type="primary"
								outline
								onClick={openFileDialog}
							>
								{__('Upload Logo', 'surecart')}
							</ScButton>
						);
					}}
				>
					{__('Upload Logo', 'surecart')}
				</FormFileUpload>
				<DropZone onFilesDrop={uploadImage} />
			</div>
		);
	};

	return (
		<ScFormControl label={__('Logo', 'surecart')}>
			{!!error && (
				<sc-alert open={!!error} type="danger">
					{error}
				</sc-alert>
			)}
			{renderContent()}
		</ScFormControl>
	);
};

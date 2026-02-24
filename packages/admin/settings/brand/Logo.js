/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ScFormControl } from '@surecart/components-react';
import { Button } from '@wordpress/components';
import MediaLibrary from '../../components/MediaLibrary';

export default ({ label, brand, editBrand, loading, logoKey = 'logo' }) => {
	const [previewUrl, setPreviewUrl] = useState(null);

	const onSelectMedia = (media) => {
		setPreviewUrl(media?.url);
		return editBrand({ [logoKey]: media?.id });
	};

	const onRemoveMedia = () => {
		const r = confirm(
			__('Are you sure you want to remove this logo?', 'surecart')
		);
		if (!r) return;
		setPreviewUrl(null);
		return editBrand({ [logoKey]: '' });
	};

	const displayUrl = previewUrl || brand?.[logoKey]?.url;

	const renderContent = () => {
		if (displayUrl) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={displayUrl}
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
					/>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<MediaLibrary
								onSelect={onSelectMedia}
								isPrivate={false}
								render={({ setOpen }) => {
									return (
										<Button
											isPrimary
											onClick={() => setOpen(true)}
										>
											{__('Replace', 'surecart')}
										</Button>
									);
								}}
							></MediaLibrary>
							<Button isTertiary onClick={onRemoveMedia}>
								{__('Remove', 'surecart')}
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return (
			<ScFormControl label={label} showLabel={false}>
				<MediaLibrary
					onSelect={onSelectMedia}
					isPrivate={false}
					render={({ setOpen }) => {
						return (
							<Button isPrimary onClick={() => setOpen(true)}>
								{__('Add Image', 'surecart')}
							</Button>
						);
					}}
				></MediaLibrary>
			</ScFormControl>
		);
	};

	return <ScFormControl label={label}>{renderContent()}</ScFormControl>;
};

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ScFormControl } from '@surecart/components-react';
import { Button } from '@wordpress/components';
import MediaLibrary from '../../components/MediaLibrary';

export default ({
	label = __('Add Image', 'surecart'),
	brand,
	editBrand,
	logoKey = 'logo',
	isDark = false,
	onMediaChange,
}) => {
	const [previewUrl, setPreviewUrl] = useState(null);

	useEffect(() => {
		if (brand?.[logoKey]?.url) {
			setPreviewUrl(null);
		}
	}, [brand?.[logoKey]?.url]);

	const onSelectMedia = (media) => {
		setPreviewUrl(media?.url);
		onMediaChange?.(media?.url);
		return editBrand({ [logoKey]: media?.id });
	};

	const onRemoveMedia = () => {
		const r = confirm(
			__('Are you sure you want to remove this logo?', 'surecart')
		);
		if (!r) return;
		setPreviewUrl(null);
		onMediaChange?.(null);
		return editBrand({ [logoKey]: '' });
	};

	const displayUrl = previewUrl || brand?.[logoKey]?.url;

	const renderContent = () => {
		if (displayUrl) {
			return (
				<div>
					<img
						src={displayUrl}
						alt="logo"
						css={css`
							width: 100%;
							max-height: 5rem;
							object-fit: contain;
							height: auto;
							display: block;
							border-radius: var(--sc-border-radius-medium);
						`}
					/>
					{/* Overlay icon buttons */}
					<div
						css={css`
							position: absolute;
							top: 6px;
							right: 6px;
							display: flex;
							gap: 4px;
						`}
					>
						<MediaLibrary
							onSelect={onSelectMedia}
							isPrivate={false}
							render={({ setOpen }) => (
								<Button
									onClick={() => setOpen(true)}
									label={__('Replace', 'surecart')}
									css={css`
										min-width: 28px !important;
										width: 28px !important;
										height: 28px !important;
										padding: 0 !important;
										display: flex !important;
										align-items: center;
										justify-content: center;
										background: rgba(
											${isDark
												? '255, 255, 255, 0.15'
												: '0, 0, 0, 0.5'}
										) !important;
										border-radius: 6px !important;
										border: none !important;
										color: #fff !important;
										backdrop-filter: blur(4px);
										&:hover {
											background: rgba(
												${isDark
													? '255, 255, 255, 0.25'
													: '0, 0, 0, 0.7'}
											) !important;
										}
									`}
								>
									<sc-icon
										name="refresh-cw"
										style={{ fontSize: '14px' }}
									></sc-icon>
								</Button>
							)}
						/>
						<Button
							onClick={onRemoveMedia}
							label={__('Remove', 'surecart')}
							css={css`
								min-width: 28px !important;
								width: 28px !important;
								height: 28px !important;
								padding: 0 !important;
								display: flex !important;
								align-items: center;
								justify-content: center;
								background: rgba(
									${isDark
										? '255, 255, 255, 0.15'
										: '0, 0, 0, 0.5'}
								) !important;
								border-radius: 6px !important;
								border: none !important;
								color: #fff !important;
								backdrop-filter: blur(4px);
								&:hover {
									background: rgba(220, 38, 38, 0.8) !important;
								}
							`}
						>
							<sc-icon
								name="trash-2"
								style={{ fontSize: '14px' }}
							></sc-icon>
						</Button>
					</div>
				</div>
			);
		}

		return (
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
		);
	};

	return (
		<ScFormControl label={label}>
			<div
				css={css`
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					background: ${isDark
						? 'var(--sc-color-gray-900, #1a1a2e)'
						: 'var(--sc-color-gray-200, #e5e7eb)'};
					border-radius: var(--sc-input-border-radius-large, 8px);
					padding: 1em;
				`}
			>
				{renderContent()}
			</div>
		</ScFormControl>
	);
};

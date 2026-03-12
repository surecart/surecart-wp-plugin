/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ScFormControl, ScInput, ScIcon } from '@surecart/components-react';
import ColorPopup from '../../../../blocks/components/ColorPopup';
import Logo from '../Logo';
import CheckoutPreview from './CheckoutPreview';

const ThemeModeCard = ({
	mode = 'light',
	isActive = false,
	brand,
	editBrand,
	colorKey = 'color',
	logoKey = 'logo',
}) => {
	const [previewLogoUrl, setPreviewLogoUrl] = useState(null);
	const isLight = mode === 'light';
	const iconName = isLight ? 'sun' : 'moon';
	const label = isLight
		? __('Light Mode', 'surecart')
		: __('Dark Mode', 'surecart');

	return (
		<div
			css={css`
				border-width: 2px;
				border-style: solid;
				border-color: ${isActive
					? '#00824C'
					: 'var(--sc-color-gray-300, #d1d5db)'};
				border-radius: var(--sc-input-border-radius-large, 8px);
				overflow: hidden;
				transition: border-color 0.2s ease;
				background: ${isActive ? '#F0FDF4' : 'transparent'};
			`}
		>
			{/* Clickable header */}
			<div
				role="button"
				tabIndex={0}
				onClick={() => editBrand({ theme: mode })}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						editBrand({ theme: mode });
					}
				}}
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
					padding: 1em 1.2em;
					cursor: pointer;
					background: transparent;
					border-bottom: 1px solid var(--sc-color-gray-200, #e5e7eb);
					&:hover {
						background: ${isActive
							? 'transparent'
							: 'var(--sc-color-gray-50, #f9fafb)'};
					}
				`}
			>
				<ScIcon name={iconName} style={{ fontSize: '16px' }}></ScIcon>
				<span
					css={css`
						font-weight: 600;
						font-size: 14px;
					`}
				>
					{label}
				</span>
				<ScIcon
					name={isActive ? 'check-circle' : 'circle'}
					style={{
						fontSize: '16px',
						color: isActive
							? 'var(--sc-color-primary-500, #10b981)'
							: 'var(--sc-color-gray-400, #9ca3af)',
						marginLeft: 'auto',
					}}
				></ScIcon>
			</div>

			{/* Card body */}
			<div
				css={css`
					padding: 1em;
					display: flex;
					flex-direction: column;
					gap: 0.8em;
				`}
			>
				{/* Checkout preview */}
				<CheckoutPreview
					mode={mode}
					brandColor={brand?.[colorKey]}
					logoUrl={previewLogoUrl || brand?.[logoKey]?.url}
					onClick={() => editBrand({ theme: mode })}
				/>

				{/* Brand Color */}
				<ScFormControl label={__('Brand Color', 'surecart')}>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ColorPopup
							color={`#${brand?.[colorKey] ?? ''}`}
							setColor={(color) => {
								editBrand({
									[colorKey]: color?.hex.replace('#', ''),
								});
							}}
						/>
						<ScInput
							css={css`
								flex: 1;
							`}
							value={brand?.[colorKey]}
							onScInput={(e) =>
								editBrand({
									[colorKey]: e.target.value.replace('#', ''),
								})
							}
						>
							<div slot="prefix" style={{ opacity: '0.5' }}>
								#
							</div>
						</ScInput>
					</div>
				</ScFormControl>

				{/* Logo */}
				<Logo
					label={__('Logo', 'surecart')}
					brand={brand}
					editBrand={editBrand}
					logoKey={logoKey}
					isDark={!isLight}
					onMediaChange={setPreviewLogoUrl}
				/>
			</div>
		</div>
	);
};

export default ThemeModeCard;

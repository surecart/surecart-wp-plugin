/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

const CheckoutPreview = ({
	mode = 'light',
	brandColor = '6366f1',
	logoUrl,
	onClick,
}) => {
	const isLight = mode === 'light';
	const bg = isLight ? '#ffffff' : '#1a1a2e';
	const cardBg = isLight ? '#f9fafb' : '#252540';
	const textColor = isLight ? '#111827' : '#e5e7eb';
	const mutedColor = isLight ? '#9ca3af' : '#6b7280';
	const accentColor = `#${brandColor || (isLight ? '6366f1' : '818cf8')}`;

	return (
		<div
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={onClick}
			onKeyDown={
				onClick
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onClick(e);
							}
					  }
					: undefined
			}
			css={css`
				border-radius: 8px;
				overflow: hidden;
				border: 1px solid ${isLight ? '#e5e7eb' : '#374151'};
				font-size: 10px;
				user-select: none;
				${onClick ? 'cursor: pointer;' : 'pointer-events: none;'}
			`}
		>
			{/* Browser chrome */}
			<div
				css={css`
					background: ${isLight ? '#f3f4f6' : '#1f1f35'};
					padding: 6px 10px;
					display: flex;
					align-items: center;
					gap: 4px;
				`}
			>
				<span
					css={css`
						width: 7px;
						height: 7px;
						border-radius: 50%;
						background: #ef4444;
					`}
				/>
				<span
					css={css`
						width: 7px;
						height: 7px;
						border-radius: 50%;
						background: #eab308;
					`}
				/>
				<span
					css={css`
						width: 7px;
						height: 7px;
						border-radius: 50%;
						background: #22c55e;
					`}
				/>
			</div>

			{/* Checkout body */}
			<div
				css={css`
					background: ${bg};
					padding: 14px 16px;
					display: flex;
					flex-direction: column;
					gap: 8px;
				`}
			>
				{/* Logo placeholder */}
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 6px;
						margin-bottom: 2px;
					`}
				>
					{logoUrl ? (
						<img
							src={logoUrl}
							alt=""
							css={css`
								max-width: 80px;
								max-height: 24px;
								object-fit: contain;
							`}
						/>
					) : (
						<>
							<div
								css={css`
									width: 18px;
									height: 18px;
									border-radius: 4px;
									background: ${accentColor};
									flex-shrink: 0;
								`}
							/>
							<div
								css={css`
									width: 50px;
									height: 6px;
									border-radius: 3px;
									background: ${textColor};
									opacity: 0.7;
								`}
							/>
						</>
					)}
				</div>

				{/* Form field placeholders */}
				<div
					css={css`
						background: ${cardBg};
						border-radius: 4px;
						padding: 0 8px;
						height: 12px;
						display: flex;
						align-items: center;
						border: 1px solid ${isLight ? '#e5e7eb' : '#374151'};
					`}
				>
					<div
						css={css`
							width: 40%;
							height: 2px;
							border-radius: 1px;
							background: ${mutedColor};
							opacity: 0.5;
						`}
					/>
				</div>
				<div
					css={css`
						background: ${cardBg};
						border-radius: 4px;
						padding: 0 8px;
						height: 12px;
						display: flex;
						align-items: center;
						border: 1px solid ${isLight ? '#e5e7eb' : '#374151'};
					`}
				>
					<div
						css={css`
							width: 60%;
							height: 2px;
							border-radius: 1px;
							background: ${mutedColor};
							opacity: 0.5;
						`}
					/>
				</div>

				{/* Buy Now button */}
				<div
					css={css`
						background: ${accentColor};
						border-radius: 4px;
						padding: 6px;
						text-align: center;
						color: #ffffff;
						font-weight: 600;
						font-size: 9px;
						margin-top: 2px;
					`}
				>
					{__('Buy Now', 'surecart')}
				</div>
			</div>
		</div>
	);
};

export default CheckoutPreview;

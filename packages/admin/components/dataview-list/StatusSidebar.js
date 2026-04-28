/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { __experimentalHStack as HStack, Button } from '@wordpress/components';
import { Icon, chevronLeft, external } from '@wordpress/icons';

export default ({
	heading,
	description,
	tabs,
	activeValue,
	onChange,
	onBack,
	siteName,
	siteHref,
}) => (
	<div
		role="region"
		aria-label={heading || __('Filters', 'surecart')}
		css={css`
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 280px;
			min-width: 280px;
			background: #1e1e1e;
			color: #e0e0e0;

			.components-button {
				color: inherit;
			}
			.components-button:not(:disabled):hover {
				color: #fff;
				background: rgba(255, 255, 255, 0.08);
			}
			.components-button:not(:disabled):focus-visible {
				box-shadow: 0 0 0 2px var(--wp-admin-theme-color, #3858e9);
				outline: 2px solid transparent;
			}
			.components-button svg {
				fill: currentColor;
			}
		`}
	>
		{siteName ? (
			<div
				css={css`
					padding: 12px 16px;
					background: #1e1e1e;
					margin-top: -1px;
					border-bottom: 1px solid rgba(255, 255, 255, 0.05);
				`}
			>
				<a
					href={siteHref || '#'}
					target="_blank"
					rel="noopener noreferrer"
					css={css`
						display: inline-flex;
						align-items: center;
						gap: 8px;
						color: #fff;
						font-weight: 500;
						text-decoration: none;
						min-width: 0;

						&:hover .sc-status-sidebar__site-arrow {
							opacity: 1;
							transform: translate(2px, -2px);
						}
					`}
				>
					<span
						aria-hidden="true"
						css={css`
							display: inline-flex;
							align-items: center;
							justify-content: center;
							width: 24px;
							height: 24px;
							border-radius: 2px;
							background: var(--wp-admin-theme-color, #3858e9);
							color: #fff;
							font-size: 12px;
							font-weight: 600;
							flex: 0 0 24px;
						`}
					>
						S
					</span>
					<span
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						`}
					>
						{siteName}
					</span>
					<span
						aria-hidden="true"
						className="sc-status-sidebar__site-arrow"
						css={css`
							display: inline-flex;
							align-items: center;
							color: #949494;
							opacity: 0.7;
							transition: opacity 120ms ease, transform 120ms ease;
						`}
					>
						<Icon icon={external} size={16} />
					</span>
				</a>
			</div>
		) : null}

		{heading ? (
			<div
				css={css`
					padding: 16px 16px 8px;
				`}
			>
				<HStack
					spacing={1}
					justify="flex-start"
					alignment="center"
					css={css`
						margin-left: -8px;
					`}
				>
					{onBack ? (
						<Button
							icon={chevronLeft}
							label={__('Back', 'surecart')}
							onClick={onBack}
							size="small"
						/>
					) : null}
					<span
						css={css`
							font-size: 17px;
							font-weight: 500;
							color: #fff;
							line-height: 1.2;
						`}
					>
						{heading}
					</span>
				</HStack>
				{description ? (
					<p
						css={css`
							margin: 8px 0 0;
							color: #949494;
							font-size: 13px;
							line-height: 1.5;
						`}
					>
						{description}
					</p>
				) : null}
			</div>
		) : null}

		<div
			role="tablist"
			aria-label={heading || __('Status', 'surecart')}
			css={css`
				padding: 4px 8px 16px;
			`}
		>
			{tabs.map((tab) => {
				const isActive = tab.value === activeValue;
				return (
					<Button
						key={String(tab.value)}
						role="tab"
						aria-selected={isActive}
						aria-current={isActive ? 'page' : undefined}
						onClick={() => onChange(tab.value)}
						icon={tab.icon}
						css={css`
							width: 100%;
							justify-content: flex-start !important;
							padding: 6px 12px !important;
							height: auto !important;
							min-height: 36px;
							margin: 1px 0;
							border-radius: 2px;
							font-weight: 400;

							${isActive &&
							css`
								color: #fff !important;
								background: rgba(
									255,
									255,
									255,
									0.12
								) !important;
							`}
						`}
					>
						<span
							css={css`
								flex: 1 1 auto;
								text-align: left;
							`}
						>
							{tab.label}
						</span>
						{typeof tab.count === 'number' && (
							<span
								css={css`
									font-size: 12px;
									color: #949494;
								`}
							>
								{tab.count}
							</span>
						)}
					</Button>
				);
			})}
		</div>
	</div>
);

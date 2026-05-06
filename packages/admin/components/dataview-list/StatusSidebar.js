/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	Button,
	VisuallyHidden,
} from '@wordpress/components';
import { chevronLeft } from '@wordpress/icons';

const SiteIcon = ({ iconUrl }) => {
	if (iconUrl) {
		return (
			<img
				alt=""
				src={iconUrl}
				css={css`
					display: block;
					width: 100%;
					height: 100%;
					object-fit: cover;
				`}
			/>
		);
	}
	return (
		<span
			aria-hidden="true"
			css={css`
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				background: var(--wp-admin-theme-color, #3858e9);
				color: #fff;
				font-size: 12px;
				font-weight: 600;
			`}
		>
			{siteName ? siteName.charAt(0).toUpperCase() : ''}
		</span>
	);
};

export default ({
	heading,
	description,
	tabs,
	activeValue,
	onChange,
	onBack,
	siteName,
	siteHref,
	siteIconUrl,
	dashboardHref,
}) => (
	<div
		role="region"
		aria-label={heading || __('Filters', 'surecart')}
		css={css`
			display: flex;
			flex-direction: column;
			height: calc(100% + 1px);
			margin-top: -1px;
			width: 320px;
			min-width: 320px;
			background: #1e1e1e;
			color: #e0e0e0;

			/* Dark-theme treatment over WP component primitives. Site Editor
			   does the same trick — neutral components painted dark by their
			   wrapping context. */
			.components-button,
			.components-item {
				color: inherit;
			}
			.components-button:not(:disabled):hover,
			.components-item:hover {
				color: #fff;
				background: rgba(255, 255, 255, 0.08);
			}
			.components-button:focus-visible,
			.components-item:focus-visible {
				box-shadow: 0 0 0 2px var(--wp-admin-theme-color, #3858e9);
				outline: 2px solid transparent;
			}
			.components-button svg,
			.components-item svg {
				fill: currentColor;
			}
		`}
	>
		{siteName ? (
			<HStack
				spacing={2}
				justify="flex-start"
				alignment="center"
				css={css`
					padding: 12px 16px;
					border-bottom: 1px solid rgba(255, 255, 255, 0.05);
				`}
			>
				<Button
					href={dashboardHref || 'index.php'}
					label={__('Go to the Dashboard', 'surecart')}
					css={css`
						width: 32px;
						height: 32px;
						padding: 0 !important;
						border-radius: 4px;
						overflow: hidden;
						flex: 0 0 32px;
					`}
				>
					<SiteIcon iconUrl={siteIconUrl} />
				</Button>
				<div
					css={css`
						flex: 1 1 auto;
						min-width: 0;
					`}
				>
					<Button
						href={siteHref || '#'}
						target="_blank"
						variant="link"
						css={css`
							color: #fff !important;
							font-weight: 500;
							max-width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							text-decoration: none !important;
							&:hover {
								color: #fff !important;
								text-decoration: underline !important;
							}
						`}
					>
						{siteName}
						<VisuallyHidden as="span">
							{__('(opens in a new tab)', 'surecart')}
						</VisuallyHidden>
					</Button>
				</div>
			</HStack>
		) : null}

		{heading ? (
			<VStack
				spacing={4}
				css={css`
					padding: 24px 16px 16px;
				`}
			>
				<HStack spacing={1} alignment="center" justify="flex-start">
					{onBack ? (
						<Button
							icon={chevronLeft}
							label={__('Back', 'surecart')}
							onClick={onBack}
							size="compact"
							css={css`
								margin-left: -6px;
							`}
						/>
					) : null}
					<Heading
						level={2}
						css={css`
							color: #fff !important;
							margin: 0 !important;
						`}
					>
						{heading}
					</Heading>
				</HStack>
				{description ? (
					<Text
						css={css`
							color: #949494 !important;
						`}
					>
						{description}
					</Text>
				) : null}
			</VStack>
		) : null}

		<ItemGroup
			role="tablist"
			aria-label={heading || __('Status', 'surecart')}
			css={css`
				padding: 8px 8px 16px;
			`}
		>
			{tabs.map((tab) => {
				const isActive = tab.value === activeValue;
				return (
					<Item
						key={String(tab.value)}
						role="tab"
						aria-selected={isActive}
						aria-current={isActive ? 'page' : undefined}
						onClick={() => onChange(tab.value)}
						css={css`
							cursor: pointer;
							padding: 10px 12px !important;
							border-radius: 4px;
							font-size: 14px !important;

							${isActive &&
							css`
								color: #fff !important;
								font-weight: 600 !important;
							`}
						`}
					>
						<HStack spacing={3} alignment="center">
							{tab.icon ? (
								<span
									aria-hidden="true"
									css={css`
										display: inline-flex;
										flex: 0 0 24px;
									`}
								>
									{tab.icon}
								</span>
							) : null}
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
										font-size: 13px;
										color: #949494;
										font-weight: 400;
									`}
								>
									{tab.count}
								</span>
							)}
						</HStack>
					</Item>
				);
			})}
		</ItemGroup>
	</div>
);

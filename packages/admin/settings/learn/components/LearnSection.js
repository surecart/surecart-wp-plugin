/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ScButton, ScIcon, ScTag } from '@surecart/components-react';
import LearnStep from './LearnStep';

const gradientKeyframes = css`
	@keyframes gradientBorder {
		0% {
			background-position: 0% 0%;
		}
		25% {
			background-position: 100% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		75% {
			background-position: 0% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}
`;

// Outer wrapper — carries the ::before animation so overflow:hidden on the
// inner div cannot clip it. Non-highlighted sections use this as a passthrough.
const wrapperStyles = (highlighted) => css`
	border-radius: 8px;
	${highlighted &&
	css`
		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				90deg,
				#6366f1 0%,
				#c7d2fe 50%,
				#6366f1 100%
			);
			background-size: 200% 200%;
			animation: gradientBorder 6s linear infinite;
			mask: linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask-composite: exclude;
			-webkit-mask-composite: xor;
			padding: 1px;
			border-radius: 8px;
			pointer-events: none;
		}
	`}
`;

// Inner section — handles overflow clipping and the static border for
// non-highlighted sections. For highlighted, margin:1px exposes the
// animated border from the outer wrapper.
const sectionStyles = (highlighted) => css`
	border: ${highlighted
		? 'none'
		: '1px solid var(--sc-color-gray-200, #e5e7eb)'};
	border-radius: ${highlighted ? '7px' : '8px'};
	overflow: hidden;
	background: white;
	${highlighted && 'margin: 1px;'}
`;

const headerStyles = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	cursor: pointer;
	user-select: none;
	transition: background 0.15s ease;
	background: none;
	border: none;
	width: 100%;
	text-align: left;
	font: inherit;
	color: inherit;

	&:hover {
		background: var(--sc-color-gray-50, #f9fafb);
	}
`;

const headerLeftStyles = css`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
	min-width: 0;
`;

const titleRowStyles = css`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const titleStyles = css`
	font-weight: 600;
	font-size: 15px;
	color: var(--sc-color-gray-900, #111827);
	margin: 0;
`;

const sectionIconStyles = css`
	width: 18px;
	height: 18px;
	color: var(--sc-color-gray-400, #9ca3af);
	flex-shrink: 0;
`;

const getBadgeType = (badge) => {
	if (badge === 'required') return 'warning';
	if (badge === 'recommended') return 'default';
	return 'default';
};

const descriptionStyles = css`
	font-size: 13px;
	color: var(--sc-color-gray-500, #6b7280);
	margin: 0;
	line-height: 1.5;
`;

const headerRightStyles = css`
	display: flex;
	align-items: center;
	gap: 12px;
	flex-shrink: 0;
`;

const learnLinkStyles = css`
	font-size: 10px;
`;

const chevronStyles = (isOpen) => css`
	width: 20px;
	height: 20px;
	color: var(--sc-color-gray-400, #9ca3af);
	transition: transform 0.2s ease;
	transform: rotate(${isOpen ? '180deg' : '0deg'});
`;

const bodyStyles = (isOpen) => css`
	display: ${isOpen ? 'block' : 'none'};
	border-top: 1px solid var(--sc-color-gray-200, #e5e7eb);
`;

const sectionHeadingStyles = css`
	margin: 0;
	font: inherit;
`;

const getBadgeLabel = (badge) => {
	if (badge === 'required') return __('Required', 'surecart');
	if (badge === 'recommended') return __('Recommended', 'surecart');
	if (badge === 'optional') return __('Optional', 'surecart');
	return '';
};

export default function LearnSection({
	section,
	progress,
	isStepCompleted,
	isAutoDetected,
	onToggleStep,
	defaultOpen = false,
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<>
			{section.highlighted && <Global styles={gradientKeyframes} />}
			<div css={wrapperStyles(section.highlighted)}>
				<div css={sectionStyles(section.highlighted)}>
					<h3 css={sectionHeadingStyles}>
						<button
							css={headerStyles}
							onClick={() => setIsOpen(!isOpen)}
							aria-expanded={isOpen}
							aria-controls={`learn-section-${section.id}`}
							type="button"
						>
							<div css={headerLeftStyles}>
								<div css={titleRowStyles}>
									{section.icon && (
										<ScIcon
											name={section.icon}
											css={sectionIconStyles}
										/>
									)}
									<span css={titleStyles}>
										{section.title}
									</span>
									{section.highlighted && (
										<ScIcon
											name="star"
											style={{
												width: '14px',
												height: '14px',
												color: '#fbbf24',
												flexShrink: 0,
											}}
										/>
									)}
									{section.badge && (
										<ScTag
											type={getBadgeType(section.badge)}
											size="small"
											pill
										>
											{getBadgeLabel(section.badge)}
										</ScTag>
									)}
									<ScTag
										type={
											progress.completed ===
												progress.total &&
											progress.total > 0
												? 'success'
												: 'default'
										}
										size="small"
										pill
									>
										{progress.completed}/{progress.total}
									</ScTag>
								</div>
								<p css={descriptionStyles}>
									{section.description}
								</p>
							</div>

							<div css={headerRightStyles}>
								{section.docUrl && (
									<ScButton
										pill
										css={learnLinkStyles}
										href={section.docUrl}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
									>
										{__('Learn How', 'surecart')}
										<ScIcon
											name="arrow-up-right"
											style={{
												width: '13px',
												height: '13px',
											}}
											slot="suffix"
										/>
									</ScButton>
								)}
								<ScIcon
									name="chevron-down"
									css={chevronStyles(isOpen)}
								/>
							</div>
						</button>
					</h3>

					<div
						id={`learn-section-${section.id}`}
						css={bodyStyles(isOpen)}
						aria-hidden={!isOpen}
					>
						{section.steps.map((step) => (
							<LearnStep
								key={step.id}
								step={step}
								isCompleted={isStepCompleted(step.id)}
								isAutoDetected={isAutoDetected(step.id)}
								onToggle={onToggleStep}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

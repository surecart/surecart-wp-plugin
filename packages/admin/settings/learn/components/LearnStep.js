/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScButton, ScIcon } from '@surecart/components-react';

const stepStyles = css`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px 20px;
	border-bottom: 1px solid var(--sc-color-gray-200, #e5e7eb);

	&:last-child {
		border-bottom: none;
	}
`;

const checkboxStyles = (isCompleted) => css`
	flex-shrink: 0;
	width: 22px;
	height: 22px;
	border-radius: 50%;
	border: 2px solid
		${isCompleted
			? 'var(--sc-color-primary-500, #6366f1)'
			: 'var(--sc-color-gray-300, #d1d5db)'};
	background: ${isCompleted
		? 'var(--sc-color-primary-500, #6366f1)'
		: 'transparent'};
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.15s ease;
	margin-top: 2px;

	&:hover {
		border-color: var(--sc-color-primary-500, #6366f1);
	}

	svg {
		width: 12px;
		height: 12px;
		color: white;
	}
`;

const contentStyles = css`
	flex: 1;
	min-width: 0;
`;

const titleStyles = css`
	font-weight: 600;
	font-size: 14px;
	color: var(--sc-color-gray-900, #111827);
	margin: 0 0 4px 0;
	display: flex;
	align-items: center;
	gap: 6px;
`;

const descriptionStyles = css`
	font-size: 13px;
	color: var(--sc-color-gray-500, #6b7280);
	margin: 0;
	line-height: 1.5;
`;

const tooltipWrapperStyles = css`
	position: relative;
	display: inline-flex;
`;

const tooltipIconStyles = css`
	width: 15px;
	stroke-width: 2.5px;
	color: var(--sc-input-help-text-color);
	cursor: help;
`;

const tooltipContentStyles = css`
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	transform: translateX(-50%);
	background: var(--sc-color-gray-900, #111827);
	color: white;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 12px;
	line-height: 1.5;
	width: 240px;
	z-index: 10;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	pointer-events: none;
`;

const actionStyles = css`
	flex-shrink: 0;
`;

export default function LearnStep({
	step,
	isCompleted,
	isAutoDetected: isAuto,
	onToggle,
}) {
	const [showTooltip, setShowTooltip] = useState(false);

	const handleCheckboxClick = () => {
		if (!isAuto) {
			onToggle(step.id);
		}
	};

	const actionProps = step.isExternal
		? { href: step.actionUrl, target: '_blank', rel: 'noopener noreferrer' }
		: { href: step.actionUrl };

	return (
		<div css={stepStyles}>
			<div
				css={checkboxStyles(isCompleted)}
				onClick={handleCheckboxClick}
				role="checkbox"
				aria-checked={isCompleted}
				aria-label={step.title}
				tabIndex={isAuto ? -1 : 0}
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault();
						handleCheckboxClick();
					}
				}}
				style={{ cursor: isAuto ? 'default' : 'pointer' }}
			>
				{isCompleted && (
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				)}
			</div>

			<div css={contentStyles}>
				<div css={titleStyles}>
					<span style={isCompleted ? { opacity: 0.5 } : {}}>
						{step.title}
					</span>
					{step.infoTooltip && (
						<div
							css={tooltipWrapperStyles}
							onMouseEnter={() => setShowTooltip(true)}
							onMouseLeave={() => setShowTooltip(false)}
							onFocus={() => setShowTooltip(true)}
							onBlur={() => setShowTooltip(false)}
							tabIndex={0}
						>
							<ScIcon
								name="info"
								css={tooltipIconStyles}
								aria-describedby={
									showTooltip
										? `tooltip-${step.id}`
										: undefined
								}
							/>
							{showTooltip && (
								<div
									css={tooltipContentStyles}
									role="tooltip"
									id={`tooltip-${step.id}`}
								>
									{step.infoTooltip}
								</div>
							)}
						</div>
					)}
				</div>
				<p css={descriptionStyles}>{step.description}</p>
			</div>

			{step.actionUrl && !isCompleted && (
				<div css={actionStyles}>
					<ScButton type="link" size="small" {...actionProps}>
						{step.actionLabel}
						{step.isExternal && (
							<ScIcon
								name="external-link"
								slot="suffix"
								style={{
									width: '14px',
									height: '14px',
								}}
							/>
						)}
					</ScButton>
				</div>
			)}
		</div>
	);
}

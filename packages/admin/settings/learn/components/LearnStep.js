/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScCheckbox, ScIcon } from '@surecart/components-react';
import HelpTooltip from '../../../components/HelpTooltip';

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

const tooltipIconStyles = css`
	width: 15px;
	stroke-width: 2.5px;
	color: var(--sc-input-help-text-color);
	cursor: help;
	opacity: 0.5;
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
	const handleCheckboxClick = () => {
		if (!isAuto) {
			onToggle(step.id);
		}
	};

	const actionProps = {
		href: step.actionUrl,
		target: '_blank',
		rel: 'noopener noreferrer',
	};

	return (
		<div css={stepStyles}>
			<ScCheckbox
				checked={isCompleted}
				disabled={isAuto}
				onScChange={handleCheckboxClick}
				style={{ marginTop: '2px' }}
				aria-label={step.title}
			/>

			<div css={contentStyles}>
				<div css={titleStyles}>
					<span style={isCompleted ? { opacity: 0.5 } : {}}>
						{step.title}
					</span>
					{step.infoTooltip && (
						<HelpTooltip
							content={
								<p style={{ margin: 0 }}>{step.infoTooltip}</p>
							}
							position="bottom center"
							width="260px"
						>
							<ScIcon name="info" css={tooltipIconStyles} />
						</HelpTooltip>
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
						<ScIcon
							name="arrow-right"
							slot="suffix"
							style={{
								width: '12px',
								height: '12px',
							}}
						/>
					</ScButton>
				</div>
			)}
		</div>
	);
}

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import LearnStep from './LearnStep';

// Outer wrapper — carries the ::before animation so overflow:hidden on the
// inner div cannot clip it. Non-highlighted sections use this as a passthrough.
const wrapperStyles = ( highlighted ) => css`
	border-radius: 8px;
	${ highlighted && css`
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
	` }
`;

// Inner section — handles overflow clipping and the static border for
// non-highlighted sections. For highlighted, margin:1px exposes the
// animated border from the outer wrapper.
const sectionStyles = ( highlighted ) => css`
	border: ${ highlighted
		? 'none'
		: '1px solid var(--sc-color-gray-200, #e5e7eb)' };
	border-radius: ${ highlighted ? '7px' : '8px' };
	overflow: hidden;
	background: white;
	${ highlighted && 'margin: 1px;' }
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

const badgeStyles = ( type ) => css`
	display: inline-flex;
	align-items: center;
	padding: 2px 8px;
	border-radius: 9999px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.025em;
	background: ${ type === 'required'
		? 'var(--sc-color-primary-50, #eef2ff)'
		: type === 'recommended'
		? 'var(--sc-color-warning-50, #fffbeb)'
		: 'var(--sc-color-gray-100, #f3f4f6)' };
	color: ${ type === 'required'
		? 'var(--sc-color-primary-600, #4f46e5)'
		: type === 'recommended'
		? 'var(--sc-color-warning-700, #b45309)'
		: 'var(--sc-color-gray-500, #6b7280)' };
`;


const progressBadgeStyles = ( completed, total ) => css`
	display: inline-flex;
	align-items: center;
	padding: 2px 8px;
	border-radius: 9999px;
	font-size: 12px;
	font-weight: 600;
	background: ${ completed === total && total > 0
		? 'var(--sc-color-success-100, #dcfce7)'
		: 'var(--sc-color-gray-100, #f3f4f6)' };
	color: ${ completed === total && total > 0
		? 'var(--sc-color-success-700, #15803d)'
		: 'var(--sc-color-gray-600, #4b5563)' };
`;

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
	font-size: 13px;
	font-weight: 500;
	color: var(--sc-color-primary-500, #6366f1);
	text-decoration: none;
	white-space: nowrap;

	&:hover {
		text-decoration: underline;
	}
`;

const chevronStyles = ( isOpen ) => css`
	width: 20px;
	height: 20px;
	color: var(--sc-color-gray-400, #9ca3af);
	transition: transform 0.2s ease;
	transform: rotate( ${ isOpen ? '180deg' : '0deg' } );
`;

const bodyStyles = ( isOpen ) => css`
	display: ${ isOpen ? 'block' : 'none' };
	border-top: 1px solid var(--sc-color-gray-200, #e5e7eb);
`;

const getBadgeLabel = ( badge ) => {
	if ( badge === 'required' ) return __( 'Required', 'surecart' );
	if ( badge === 'recommended' ) return __( 'Recommended', 'surecart' );
	return __( 'Optional', 'surecart' );
};

export default function LearnSection( {
	section,
	progress,
	isStepCompleted,
	isAutoDetected,
	onToggleStep,
	defaultOpen = false,
} ) {
	const [ isOpen, setIsOpen ] = useState( defaultOpen );

	return (
		<>
			{ section.highlighted && (
				<Global
					styles={ css`
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
					` }
				/>
			) }
			<div css={ wrapperStyles( section.highlighted ) }>
				<div css={ sectionStyles( section.highlighted ) }>
					<button
						css={ headerStyles }
						onClick={ () => setIsOpen( ! isOpen ) }
						aria-expanded={ isOpen }
						type="button"
					>
						<div css={ headerLeftStyles }>
							<div css={ titleRowStyles }>
								{ section.icon && (
									<sc-icon
										name={ section.icon }
										css={ sectionIconStyles }
									/>
								) }
								<h3 css={ titleStyles }>{ section.title }</h3>
								{ section.highlighted && (
									<sc-icon
										name="star"
										style={ {
											width: '14px',
											height: '14px',
											color: '#fbbf24',
											flexShrink: 0,
										} }
									/>
								) }
								{ section.badge && (
									<span css={ badgeStyles( section.badge ) }>
										{ getBadgeLabel( section.badge ) }
									</span>
								) }
								<span
									css={ progressBadgeStyles(
										progress.completed,
										progress.total
									) }
								>
									{ progress.completed }/{ progress.total }
								</span>
							</div>
							<p css={ descriptionStyles }>
								{ section.description }
							</p>
						</div>

						<div css={ headerRightStyles }>
							{ section.docUrl && (
								<a
									css={ learnLinkStyles }
									href={ section.docUrl }
									target="_blank"
									rel="noopener noreferrer"
									onClick={ ( e ) => e.stopPropagation() }
								>
									{ __( 'Learn How', 'surecart' ) } &rarr;
								</a>
							) }
							<sc-icon
								name="chevron-down"
								css={ chevronStyles( isOpen ) }
							/>
						</div>
					</button>

					<div css={ bodyStyles( isOpen ) }>
						{ section.steps.map( ( step ) => (
							<LearnStep
								key={ step.id }
								step={ step }
								isCompleted={ isStepCompleted( step.id ) }
								isAutoDetected={ isAutoDetected( step.id ) }
								onToggle={ onToggleStep }
							/>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}

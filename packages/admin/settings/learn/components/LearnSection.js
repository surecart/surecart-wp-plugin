/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import LearnStep from './LearnStep';

const sectionStyles = css`
	border: 1px solid var(--sc-color-gray-200, #e5e7eb);
	border-radius: 8px;
	overflow: hidden;
	background: white;
`;

const headerStyles = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
	cursor: pointer;
	user-select: none;
	transition: background 0.15s ease;

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
		: 'var(--sc-color-gray-100, #f3f4f6)' };
	color: ${ type === 'required'
		? 'var(--sc-color-primary-600, #4f46e5)'
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
		<div css={ sectionStyles }>
			<div
				css={ headerStyles }
				onClick={ () => setIsOpen( ! isOpen ) }
				role="button"
				tabIndex={ 0 }
				aria-expanded={ isOpen }
				onKeyDown={ ( e ) => {
					if ( e.key === ' ' || e.key === 'Enter' ) {
						e.preventDefault();
						setIsOpen( ! isOpen );
					}
				} }
			>
				<div css={ headerLeftStyles }>
					<div css={ titleRowStyles }>
						<h3 css={ titleStyles }>{ section.title }</h3>
						{ section.badge && (
							<span css={ badgeStyles( section.badge ) }>
								{ section.badge === 'required'
									? __( 'Required', 'surecart' )
									: __( 'Optional', 'surecart' ) }
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
					<p css={ descriptionStyles }>{ section.description }</p>
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
			</div>

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
	);
}

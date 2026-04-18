/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { ScAlert, ScIcon, ScSpinner } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import LearnSection from './components/LearnSection';
import useLearnProgress from './hooks/useLearnProgress';
import learnSections from './data/learnSections';

const subtitleStyles = css`
	font-size: 14px;
	color: var(--sc-color-gray-500, #6b7280);
	margin: -1.5em 0 0 0;
	line-height: 1.6;
`;

const sectionsStyles = css`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const loadingStyles = css`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	color: var(--sc-color-gray-400, #9ca3af);
`;

const completedToggleStyles = css`
	display: flex;
	align-items: center;
	gap: 6px;
	background: none;
	border: none;
	padding: 8px 0;
	cursor: pointer;
	font-size: 13px;
	font-weight: 500;
	color: var(--sc-color-gray-500, #6b7280);
	font-family: inherit;

	&:hover {
		color: var(--sc-color-gray-700, #374151);
	}
`;

const completedChevronStyles = ( isOpen ) => css`
	width: 16px;
	height: 16px;
	transition: transform 0.2s ease;
	transform: rotate(${ isOpen ? '180deg' : '0deg' });
`;

export default function LearnSettings() {
	const {
		toggleStep,
		isStepCompleted,
		isAutoDetected,
		getSectionProgress,
		isLoading,
	} = useLearnProgress();

	const [ showCompleted, setShowCompleted ] = useState( false );

	const { incompleteSections, completedSections } = useMemo( () => {
		const incomplete = [];
		const completed = [];

		for ( const section of learnSections ) {
			const progress = getSectionProgress( section.id );
			const entry = { section, progress };
			if ( progress.completed === progress.total && progress.total > 0 ) {
				completed.push( entry );
			} else {
				incomplete.push( entry );
			}
		}

		return { incompleteSections: incomplete, completedSections: completed };
	}, [ getSectionProgress ] );

	return (
		<SettingsTemplate
			title={ __( 'Setup Checklist', 'surecart' ) }
			icon={ <ScIcon name="book-open" /> }
			noButton
		>
			<p css={ subtitleStyles }>
				{ __(
					'Set up your store step by step and make your first sale with confidence.',
					'surecart'
				) }
			</p>

			{ isLoading ? (
				<div css={ loadingStyles }>
					<ScSpinner />
				</div>
			) : (
				<div css={ sectionsStyles }>
					{ incompleteSections.length === 0 && (
						<ScAlert type="success" open>
							<ScIcon name="check-circle" slot="icon" />
							{ __(
								"Your store setup is complete! You're ready to start selling.",
								'surecart'
							) }
						</ScAlert>
					) }

					{ incompleteSections.map( ( { section, progress }, index ) => (
						<LearnSection
							key={ section.id }
							section={ section }
							progress={ progress }
							isStepCompleted={ isStepCompleted }
							isAutoDetected={ isAutoDetected }
							onToggleStep={ toggleStep }
							defaultOpen={ index === 0 }
						/>
					) ) }

					{ completedSections.length > 0 && (
						<>
							<button
								type="button"
								css={ completedToggleStyles }
								onClick={ () => setShowCompleted( ! showCompleted ) }
								aria-expanded={ showCompleted }
							>
								<ScIcon
									name="chevron-down"
									css={ completedChevronStyles( showCompleted ) }
								/>
								{ sprintf(
									/* translators: %d: number of completed sections */
									__( 'Completed (%d)', 'surecart' ),
									completedSections.length
								) }
							</button>

							{ showCompleted && completedSections.map( ( { section, progress } ) => (
								<LearnSection
									key={ section.id }
									section={ section }
									progress={ progress }
									isStepCompleted={ isStepCompleted }
									isAutoDetected={ isAutoDetected }
									onToggleStep={ toggleStep }
									defaultOpen={ false }
								/>
							) ) }
						</>
					) }
				</div>
			) }
		</SettingsTemplate>
	);
}

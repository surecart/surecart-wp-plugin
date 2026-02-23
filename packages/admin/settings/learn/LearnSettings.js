/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
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

export default function LearnSettings() {
	const {
		toggleStep,
		isStepCompleted,
		isAutoDetected,
		getSectionProgress,
		isLoading,
	} = useLearnProgress();

	return (
		<SettingsTemplate
			title={ __( 'Learn SureCart', 'surecart' ) }
			icon={ <sc-icon name="book-open" /> }
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
					<sc-spinner />
				</div>
			) : (
				<div css={ sectionsStyles }>
					{ learnSections.map( ( section, index ) => (
						<LearnSection
							key={ section.id }
							section={ section }
							progress={ getSectionProgress( section.id ) }
							isStepCompleted={ isStepCompleted }
							isAutoDetected={ isAutoDetected }
							onToggleStep={ toggleStep }
							defaultOpen={ index === 0 }
						/>
					) ) }
				</div>
			) }
		</SettingsTemplate>
	);
}

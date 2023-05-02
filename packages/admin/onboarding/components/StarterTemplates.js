/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import TemplateDefaultImg from '../template_default.svg';
import ProgressIndicator from './ProgressIndicator';

const templates = [
	{
		name: 'Donations',
		imgUrl: 'https://source.unsplash.com/200x200?donation',
	},
	{
		name: 'Clothing',
		imgUrl: 'https://source.unsplash.com/200x200?clothing',
	},
	{
		name: 'Food & Beverages',
		imgUrl: 'https://source.unsplash.com/200x200?food',
	},
	{ name: 'Cosmetics', imgUrl: 'https://source.unsplash.com/200x200?beauty' },
	{
		name: 'Digital Products',
		imgUrl: 'https://source.unsplash.com/200x200?computers',
	},
];

export default ({
	currentStep,
	handleStepChange,
	selectedTemplate,
	onSelectTemplate,
}) => {
	console.log('selectedTemplate', selectedTemplate);
	return (
		<div>
			<StepHeader
				imageNode={
					<sc-icon
						name="book-open"
						style={{
							fontSize: '38px',
							color: 'var(--sc-color-brand-primary)',
						}}
					></sc-icon>
				}
				title={__('Select A Starting Point', 'surecart')}
				label={__(
					'Choose some example data or start from scratch.',
					'surecart'
				)}
			/>
			<div
				css={css`
					display: grid;
					grid-template-columns: repeat(1, 1fr);
					gap: 40px;
					padding: 60px 20px 0;
					@media (min-width: 781px) {
						padding: 60px 120px 0;
						grid-template-columns: repeat(3, 1fr);
					}
					@media (min-width: 1760px) {
						grid-template-columns: repeat(4, 1fr);
					}
					@media (min-width: 2180px) {
						grid-template-columns: repeat(5, 1fr);
					}
				`}
			>
				<TemplateItem
					template={{ name: 'Start From Scratch' }}
					active={selectedTemplate === 0}
					onItemClick={() => onSelectTemplate(0)}
				/>
				{templates.map((template, idx) => (
					<TemplateItem
						key={idx}
						active={selectedTemplate === idx + 1}
						template={template}
						onItemClick={() => onSelectTemplate(idx + 1)}
					/>
				))}
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={
					selectedTemplate !== null
						? () => handleStepChange('forward')
						: undefined
				}
			/>
		</div>
	);
};

function TemplateItem({ active, template, onItemClick }) {
	return (
		<div css={css``}>
			<div
				onClick={onItemClick}
				css={css`
					cursor: pointer;
					aspect-ratio: 1.16/1;
					margin-bottom: 16px;
					border-radius: 5px;
					overflow: hidden;
					background-color: #f3f3f3;
					border: 1.5px solid
						${active ? 'var(--sc-color-brand-primary)' : '#dce0e6'};
					outline: 1.5px solid
						${active
							? 'var(--sc-color-brand-primary)'
							: 'transparent'};
					transition: outline-color 0.3s, border-color 0.3s;
					&:hover {
						border-color: var(--sc-color-brand-primary);
					}
				`}
			>
				<img
					css={css`
						width: 100%;
						height: 100%;
						object-fit: cover;
					`}
					src={template?.imgUrl ?? TemplateDefaultImg}
					alt=""
				/>
			</div>
			<span
				css={css`
					font-size: 16px;
				`}
			>
				{template.name}
			</span>
		</div>
	);
}

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import TemplateDefaultImg from '../template_default.svg';
import ProgressIndicator from './ProgressIndicator';

const templates = [
	{
		id: null,
		name: __('Start From Scratch', 'surecart'),
	},
	{
		id: '0f681088-a74d-4aaa-9996-ef97d2ff0f32',
		name: __('Beauty & Spa', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/beauty.jpg`,
	},
	{
		id: '25e55247-e1e6-4e7b-955c-3d719618d594',
		name: __('Fashion Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/fashion.jpg`,
	},
	{
		id: '874f5380-166a-4e51-9f1e-5b72519d4cd4',
		name: __('Organic Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/organics.jpeg`,
	},
	{
		id: '0784302f-2627-4c7d-96e7-2e537d9a18ec',
		name: __('Books Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/books.jpg`,
	},
];

export default ({
	currentStep,
	handleStepChange,
	selectedTemplate,
	onSelectTemplate,
}) => {
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
					gap: 30px;
					padding: 20px 0 0;
					@media (min-width: 781px) {
						gap: 40px;
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
				{templates.map((template) => (
					<TemplateItem
						key={template.id}
						active={selectedTemplate === template.id}
						template={template}
						onItemClick={() => onSelectTemplate(template.id)}
					/>
				))}
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={() => handleStepChange('forward')}
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
